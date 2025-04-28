'use client';

import React from 'react';
import Button from '@/components/Button';
import dynamic from 'next/dynamic';

// 1) Props definition for Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (value: string) => void;
}

// 2) Dynamically import PolylineMap with no SSR
const PolylineMap = dynamic(() => import('./PolylineMap'), { ssr: false });

// 3) Modal component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onInsert }) => {
  // 4) Local state for METAR tool
  const [metarParam, setMetarParam] = React.useState('');
  const [metar, setMetar] = React.useState('');

  // 5) Local state for IFR Routes tool
  const [fromICAO, setFromICAO] = React.useState('');
  const [toICAO, setToICAO] = React.useState('');
  const [encoded, setEncoded] = React.useState<string>('');
  const [routeError, setRouteError] = React.useState<string>('');

  // 6) Don't render anything if modal is closed
  if (!isOpen) return null;

  // 7) Fetch METAR given ICAO or location string
  const fetchMetar = async (param: string) => {
    const res = await fetch(`/api/metar?q=${param}`);
    if (res.ok) {
      const text = await res.text();
      setMetar(text);
    } else {
      setMetar('Error fetching METAR');
    }
  };

  // 8) Fetch IFR route polyline between two ICAO codes
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
    // 9) Modal backdrop & container
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div
        className='fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='
        relative
        w-[85vw] max-w-2xl min-w-[680px]
        bg-gray-50 bg-opacity-90
        rounded-2xl border border-gray-200
        shadow-[0_0_20px_rgba(200,200,200,0.3)]
        p-8 flex flex-col space-y-6 z-10
      '>
        {/* 10) Header with close button */}
        <div className='flex justify-between items-center'>
          <h2 className='uppercase tracking-wider text-2xl'>Tools</h2>
          <Button variant='close' onClick={onClose}>X</Button>
        </div>

        {/* 11) METAR tool section */}
        <div className='flex flex-col space-y-4'>
          <h3 className='uppercase tracking-wide text-lg'>Get METAR</h3>
          <div className='grid items-center grid-cols-[7fr_1fr_1fr] gap-4'>
            <input
              type='text'
              placeholder='ICAO or location'
              value={metarParam}
              onChange={e => setMetarParam(e.target.value)}
              className='flex-1 bg-gray-100 bg-opacity-80 font-mono border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-500'
            />
            <Button variant='default' className='w-20' onClick={() => fetchMetar(metarParam)}>GET</Button>
            <Button
              variant={!metar || metar.toLowerCase().startsWith('error') ? 'disabled' : 'default'}
              disabled={!metar || metar.toLowerCase().startsWith('error')}
              className='self-end'
              onClick={() => {
                if (!metar.toLowerCase().startsWith('error')) {
                  onInsert('Decode: ' + metar);
                  setMetarParam('');
                  setMetar('');
                  onClose();
                }
              }}
            >
              Insert
            </Button>
          </div>
          {metar && (
            <div className='mt-4 flex flex-col space-y-2'>
              <pre className='bg-gray-100 bg-opacity-80 font-mono text-sm border border-gray-300 rounded-lg p-4 overflow-auto max-h-40 w-full'>
                {metar}
              </pre>
            </div>
          )}
        </div>

        {/* 12) IFR Routes tool section */}
        <div className='flex flex-col space-y-4 gap-y-2'>
          <h3 className='uppercase tracking-wide text-lg'>Get IFR Routes</h3>
          <div className='grid items-center grid-cols-[7fr_2fr] gap-4'>
            <div className='flex items-center justify-between'>
              <input
                type='text'
                placeholder='From ICAO'
                value={fromICAO}
                onChange={e => setFromICAO(e.target.value.toUpperCase())}
                className='w-[40%] bg-gray-100 bg-opacity-80 font-mono border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-500 text-center'
              />
              <span className='font-bold text-center'>→</span>
              <input
                type='text'
                placeholder='To ICAO'
                value={toICAO}
                onChange={e => setToICAO(e.target.value.toUpperCase())}
                className='w-[40%] bg-gray-100 bg-opacity-80 font-mono border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-500 text-center'
              />
            </div>
            <Button className='w-full self-end' onClick={() => fetchRoute(fromICAO, toICAO)}>GET</Button>
          </div>
          <div className='mt-4 flex flex-col space-y-2'>
            {routeError && (
              <pre className='bg-gray-100 bg-opacity-80 font-mono text-sm border border-gray-300 rounded-lg p-4 overflow-auto max-h-40 w-full'>
                {routeError}
              </pre>
            )}
            <div className='w-full h-[400px]'>
              <PolylineMap encoded={encoded} width='100%' height='100%' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 13) Export Modal component
export default Modal;
