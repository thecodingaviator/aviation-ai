import Button from "@/utils/components/Button";
import React from "react";

// Props definition for Metar component
interface MetarProps {
  onInsert: (value: string) => void;
  onClose: () => void;
}

const Metar = ({ onInsert, onClose }: MetarProps) => {
  const [metarParam, setMetarParam] = React.useState<string>("");
  const [metar, setMetar] = React.useState<string>("");

  // Fetch METAR given ICAO or location string
  const fetchMetar = async (param: string): Promise<void> => {
    const res = await fetch(`/api/metar?q=${param}`);
    if (res.ok) {
      const text = await res.text();
      setMetar(text);
    } else {
      setMetar("Error fetching METAR");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg tracking-wide uppercase">Get METAR</h3>
      <div className="grid grid-cols-[7fr_1fr_1fr] items-center gap-4 max-[660px]:grid-cols-2">
        <input
          type="text"
          placeholder="ICAO or location"
          value={metarParam}
          onChange={(e) => setMetarParam(e.target.value)}
          className="bg-opacity-80 flex-1 rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 font-mono placeholder-gray-500 focus:ring-2 focus:ring-gray-300 focus:outline-none max-[660px]:col-span-2"
        />
        <Button
          variant="default"
          onClick={() => fetchMetar(metarParam)}
          className="w-20 max-[660px]:w-full"
        >
          GET
        </Button>
        <Button
          variant={
            !metar || metar.toLowerCase().startsWith("error")
              ? "disabled"
              : "default"
          }
          disabled={!metar || metar.toLowerCase().startsWith("error")}
          onClick={() => {
            if (!metar.toLowerCase().startsWith("error")) {
              onInsert("Decode: " + metar);
              setMetarParam("");
              setMetar("");
              onClose();
            }
          }}
          className="self-end max-[660px]:w-full max-[660px]:self-auto"
        >
          Insert
        </Button>
      </div>
      {metar && (
        <div className="mt-4 flex flex-col space-y-2">
          <pre className="bg-opacity-80 max-h-40 w-full overflow-auto rounded-lg border border-gray-300 bg-gray-100 p-4 font-mono text-sm">
            {metar}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Metar;
