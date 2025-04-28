'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import polyline from '@mapbox/polyline';

// 1) Props for the PolylineMap component
interface PolylineMapProps {
  encoded: string;
  width?: string;
  height?: string;
}

// 2) Main component rendering a Google Map with a polyline and markers
export default function PolylineMap({
  encoded,
  width = '100%',
  height = '400px',
}: PolylineMapProps) {
  // 3) Load the Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // 4) Refs to store the map instance and the current polyline
  const mapRef = useRef<google.maps.Map | null>(null);
  const polyRef = useRef<google.maps.Polyline | null>(null);

  // 5) Decode the encoded polyline string into LatLng objects whenever it changes
  const path = useMemo(() => {
    return polyline.decode(encoded).map(([lat, lng]) => ({ lat, lng }));
  }, [encoded]);

  // 6) Determine the initial map center (first point or fallback)
  const center = path[0] ?? { lat: 0, lng: 0 };

  // 7) On path change: remove any old polyline and draw the new one
  useEffect(() => {
    if (!mapRef.current) return;

    // 7.1) Remove the existing polyline if present
    if (polyRef.current) {
      polyRef.current.setMap(null);
      polyRef.current = null;
    }

    // 7.2) Create and display the new polyline
    const gmPath = path.map(p => new google.maps.LatLng(p.lat, p.lng));
    const newPoly = new google.maps.Polyline({
      path: gmPath,
      strokeColor: 'darkblue',
      strokeOpacity: 0.8,
      strokeWeight: 4,
    });
    newPoly.setMap(mapRef.current);
    polyRef.current = newPoly;
  }, [path]);

  // 8) Handle load errors or loading state
  if (loadError) return <div>Map failed to load</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  // 9) Render the GoogleMap and place markers at each path point
  return (
    <GoogleMap
      onLoad={map => { mapRef.current = map; }}    // 9.1) Capture map instance
      mapContainerStyle={{ width, height }}       // 9.2) Container size
      center={center}                             
      zoom={2}                                    // 9.3) Default zoom
    >
      {path.map((pos, i) => (
        <Marker key={i} position={pos} />
      ))}
    </GoogleMap>
  );
}
