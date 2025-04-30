import Metar from "@/components/Metar";
import RouteSearch from "@/components/RouteSearch";
import Button from "@/utils/components/Button";
import React from "react";

// Props definition for Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (value: string) => void;
}

// Modal component
const Modal = ({ isOpen, onClose, onInsert }: ModalProps) => {
  // State to track active tab
  const [activeTab, setActiveTab] = React.useState<"METAR" | "ROUTE">("METAR");

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    // Modal backdrop & container
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-opacity-60 fixed inset-0 bg-black backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-opacity-90 relative z-10 flex h-[90vh] w-[85vw] max-w-2xl min-w-[300px] flex-col space-y-6 rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-[0_0_20px_rgba(200,200,200,0.3)]">
        {/* Header with close button */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl tracking-wider uppercase">Tools</h2>
          <Button variant="close" onClick={onClose}>
            X
          </Button>
        </div>

        {/* Tabs navigation */}
        <nav className="flex space-x-4 border-b border-gray-300">
          <button
            className={`cursor-pointer pb-2 font-medium ${
              activeTab === "METAR"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("METAR")}
          >
            Get METAR
          </button>
          <button
            className={`cursor-pointer pb-2 font-medium ${
              activeTab === "ROUTE"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("ROUTE")}
          >
            Get IFR Route
          </button>
        </nav>
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {activeTab === "METAR" && (
            <Metar onInsert={onInsert} onClose={onClose} />
          )}
          {activeTab === "ROUTE" && <RouteSearch />}
        </div>
      </div>
    </div>
  );
};

export default Modal;
