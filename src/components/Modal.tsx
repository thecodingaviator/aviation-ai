import React from 'react';
import Button from '@/utils/components/Button';

import Metar from '@/components/Metar';
import RouteSearch from '@/components/RouteSearch';

// Props definition for Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (value: string) => void;
}

// Modal component
const Modal = ({ isOpen, onClose, onInsert }: ModalProps) => {

  // State to track active tab
  const [activeTab, setActiveTab] = React.useState<'METAR' | 'ROUTE'>('METAR');

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    // Modal backdrop & container
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div
        className='fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='
        relative
        w-[85vw] max-w-2xl min-w-[300px]
        h-[90vh]
        bg-gray-50 bg-opacity-90
        rounded-2xl border border-gray-200
        shadow-[0_0_20px_rgba(200,200,200,0.3)]
        p-8 flex flex-col space-y-6 z-10
      '>
        {/* Header with close button */}
        <div className='flex justify-between items-center'>
          <h2 className='uppercase tracking-wider text-2xl'>Tools</h2>
          <Button variant='close' onClick={onClose}>X</Button>
        </div>

        {/* Tabs navigation */}
        <nav className="flex space-x-4 border-b border-gray-300">
          <button
            className={`pb-2 font-medium cursor-pointer ${activeTab === 'METAR'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
              }`}
            onClick={() => setActiveTab('METAR')}
          >
            Get METAR
          </button>
          <button
            className={`pb-2 font-medium cursor-pointer ${activeTab === 'ROUTE'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
              }`}
            onClick={() => setActiveTab('ROUTE')}
          >
            Get IFR Route
          </button>
        </nav>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'METAR' && <Metar onInsert={onInsert} onClose={onClose} />}
          {activeTab === 'ROUTE' && <RouteSearch />}
        </div>
      </div>
    </div>
  );
};

export default Modal;
