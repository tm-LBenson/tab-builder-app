import { useState, useMemo, type ReactNode } from "react";
import ChordPicker from "./components/ChordPicker";
import type { Section } from "./components/SectionList";

export interface PickerHook {
  handleWordClick: (s: number, l: number, w: number) => void;
  node: ReactNode;
}

export default function useChordPicker(
  sections: Section[],
  setSections: (s: Section[]) => void,
): PickerHook {
  const [pos, setPos] = useState<{ s: number; l: number; w: number } | null>(
    null,
  );

  const node = useMemo(() => {
    function applyChord(chord: string | null) {
      if (!pos) return;
      const copy = structuredClone(sections);
      copy[pos.s].lines[pos.l].words[pos.w].chord = chord || undefined;
      setSections(copy);
    }

    return (
      <ChordPicker
        open={pos !== null}
        onClose={() => setPos(null)}
        onSelect={applyChord}
      />
    );
  }, [pos, sections, setSections]);

  return {
    handleWordClick: (s, l, w) => setPos({ s, l, w }),
    node,
  };
}
