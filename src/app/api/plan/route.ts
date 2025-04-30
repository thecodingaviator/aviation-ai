import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export interface FPDBUser {
  id: number;
  username: string;
  gravatarHash: string;
  location: string | null;
}

export interface FPDBCycle {
  id: number;
  ident: string;
  year: number;
  release: number;
}

export interface FlightPlan {
  id: number;
  fromICAO: string;
  toICAO: string;
  fromName: string;
  toName: string;
  flightNumber: string | null;
  distance: number;
  maxAltitude: number;
  waypoints: number;
  likes: number;
  downloads: number;
  popularity: number;
  notes: string;
  encodedPolyline: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  user: FPDBUser;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  application: any; // null or whatever shape it may take later
  cycle: FPDBCycle;
}

export type PlanSearchResponse = FlightPlan[];

export async function GET(request: NextRequest) {
  // Extract and trim query parameters
  const { searchParams } = new URL(request.url);
  const fromICAO = searchParams.get("fromICAO")?.trim();
  const toICAO = searchParams.get("toICAO")?.trim();

  // Validate required parameters
  if (!fromICAO || !toICAO) {
    return NextResponse.json(
      { error: "Missing query parameters: fromICAO and toICAO are required" },
      { status: 400 },
    );
  }

  // Build the FlightPlanDatabase API URL (limit to 1 result)
  const searchUrl = `https://api.flightplandatabase.com/search/plans?fromICAO=${fromICAO}&toICAO=${toICAO}&limit=1`;

  // Fetch from FPDB
  const res = await fetch(searchUrl);

  // Handle upstream API errors
  if (!res.ok) {
    return NextResponse.json(
      { error: `FPDB API error ${res.status}: ${res.statusText}` },
      { status: res.status },
    );
  }

  // Parse JSON response into our typed array
  const plans = (await res.json()) as PlanSearchResponse;

  // Handle case with no matching flight plans
  if (plans.length === 0) {
    return NextResponse.json(
      { error: `No flight plans found from ${fromICAO} to ${toICAO}` },
      { status: 404 },
    );
  }

  // Return the encoded polyline of the first plan
  return NextResponse.json({ encodedPolyline: plans[0].encodedPolyline });
}
