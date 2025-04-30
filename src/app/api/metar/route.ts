import { NextResponse } from 'next/server';

// Geocode via OpenStreetMap/Nominatim:
async function geocode(place: string): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AviationAI/1.0' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.length) return null;
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}

// Fetch METAR by ICAO:
async function fetchMetarByIcao(icao: string): Promise<string | null> {
  const url = `https://aviationweather.gov/api/data/metar?ids=${icao}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const text = await res.text();
  return text ?? null;
}

// Fetch METAR by free-form text (via geocode + bbox):
async function fetchMetarByText(place: string): Promise<string | null> {
  const loc = await geocode(place);
  if (!loc) return null;

  // 3.Build a 10-mile bounding box around the location
  const MILE_TO_LATLONG = 0.0144927536231884; // 1 mile in degrees
  const lat0 = loc.lat - 10 * MILE_TO_LATLONG;
  const lat1 = loc.lat + 10 * MILE_TO_LATLONG;
  const lon0 = loc.lon - 10 * MILE_TO_LATLONG;
  const lon1 = loc.lon + 10 * MILE_TO_LATLONG;

  // 3.Call the METAR API with bbox
  const url = `https://aviationweather.gov/api/data/metar?bbox=${lat0}%2C${lon0}%2C${lat1}%2C${lon1}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const text = await res.text();
  return text ?? null;
}

// Main GET handler for /api/metar:
export async function GET(request: Request) {
  // Parse and validate the `q` parameter
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  if (!q) {
    console.error('Missing `q` parameter');
    return NextResponse.json(
      { error: 'Missing `q` parameter' },
      { status: 400 }
    );
  }

  let metar: string | null = null;

  // If it's a 4-letter ICAO code, fetch directly by ICAO
  if (/^[A-Za-z]{4}$/.test(q)) {
    metar = await fetchMetarByIcao(q);
  }

  // Otherwise, attempt geocode-based lookup
  if (!metar) {
    metar = await fetchMetarByText(q);
  }

  // If we got a METAR string, return as plain text
  if (metar) {
    return new Response(metar, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // No METAR found → return 404 JSON error
  return NextResponse.json(
    { error: `No METAR found for “${q}”` },
    { status: 404 }
  );
}
