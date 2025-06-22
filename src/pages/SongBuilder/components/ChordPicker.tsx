import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (chord: string | null) => void; 
}

const CHORDS = [
  "C",
  "Cm",
  "C7",
  "Cmaj7",
  "D",
  "Dm",
  "D7",
  "Dmaj7",
  "E",
  "Em",
  "E7",
  "Emaj7",
  "F",
  "Fm",
  "F7",
  "Fmaj7",
  "G",
  "Gm",
  "G7",
  "Gmaj7",
  "A",
  "Am",
  "A7",
  "Amaj7",
  "B",
  "Bm",
  "B7",
  "Bmaj7",
];

export default function ChordPicker({ open, onClose, onSelect }: Props) {
  const [custom, setCustom] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function choose(value: string | null) {
    onSelect(value);
    setCustom("");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full space-y-5">
        <h3 className="text-lg font-semibold text-red-400">Pick a chord</h3>

        <div className="grid grid-cols-4 gap-2">
          {CHORDS.map((c) => (
            <button
              key={c}
              onClick={() => choose(c)}
              className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-blue-300"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && custom.trim() && choose(custom.trim())
            }
            placeholder="Custom (e.g. Asus4)"
            className="flex-1 bg-gray-800 px-2 py-1 rounded"
          />
          <button
            onClick={() => custom.trim() && choose(custom.trim())}
            disabled={!custom.trim()}
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50"
          >
            Add
          </button>
          <button
            onClick={() => choose(null)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            title="Remove chord"
          >
            Clear
          </button>
        </div>

        <button
          onClick={onClose}
          className="block mx-auto mt-3 text-sm text-gray-400 hover:text-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
