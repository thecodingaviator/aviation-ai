import React from 'react';
import Button from '@/utils/components/Button';
import dynamic from 'next/dynamic';

// Dynamically import PolylineMap with no SSR
const PolylineMap = dynamic(() => import('../utils/components/PolylineMap'), { ssr: false });

const RouteSearch = () => {
  // Local state for IFR Routes tool
  const [fromICAO, setFromICAO] = React.useState('');
  const [toICAO, setToICAO] = React.useState('');
  const [encoded, setEncoded] = React.useState<string>('');
  const [routeError, setRouteError] = React.useState<string>('');

  // Fetch IFR route polyline between two ICAO codes
  const fetchRoute = async (from: string, to: string) => {
    const res = await fetch(`/api/plan?fromICAO=${from}&toICAO=${to}`);
    if (res.ok) {
      const json = await res.json();
      setEncoded(json.encodedPolyline);
      setRouteError('');
    } else {
      setRouteError(`Error: ${res.status} ${res.statusText}`);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="uppercase tracking-wide text-lg">Get IFR Routes</h3>
      <div className="grid items-center grid-cols-[7fr_2fr] gap-4">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="From ICAO"
            value={fromICAO}
            onChange={e => setFromICAO(e.target.value.toUpperCase())}
            className="w-[40%] bg-gray-100 bg-opacity-80 font-mono border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-500 text-center"
          />
          <span className="font-bold text-center">→</span>
          <input
            type="text"
            placeholder="To ICAO"
            value={toICAO}
            onChange={e => setToICAO(e.target.value.toUpperCase())}
            className="w-[40%] bg-gray-100 bg-opacity-80 font-mono border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-500 text-center"
          />
        </div>
        <Button
          className="w-full self-end"
          onClick={() => fetchRoute(fromICAO, toICAO)}
        >
          GET
        </Button>
      </div>
      <div className="mt-4 flex flex-col space-y-2">
        {routeError && (
          <pre className="bg-gray-100 bg-opacity-80 font-mono text-sm border border-gray-300 rounded-lg p-4 overflow-auto max-h-40 w-full">
            {routeError}
          </pre>
        )}
        <div className="w-full h-[300px]">
          <PolylineMap encoded={encoded} width="100%" height="100%" />
        </div>
      </div>
    </div>
  );
};

export default RouteSearch;
