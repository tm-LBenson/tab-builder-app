import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SectionCard from "./SectionCard";
import type { PickerHook } from "../useChordPicker";

export type SectionType = "Verse" | "Chorus" | "Bridge" | "Intro" | "Outro";
export interface Word {
  text: string;
  chord?: string;
}
export interface Line {
  words: Word[];
}
export interface Section {
  id: string;
  type: SectionType;
  lines: Line[];
}

export default function SectionList({
  sections,
  setSections,
  onEdit,
  picker,
}: {
  sections: Section[];
  onEdit: (idx: number) => void;
  setSections: (s: Section[]) => void;
  picker: PickerHook;
}) {
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = sections.findIndex((s) => s.id === active.id);
    const newIdx = sections.findIndex((s) => s.id === over.id);
    setSections(arrayMove(sections, oldIdx, newIdx));
  }

  interface DeleteSection {
    (idx: number): void;
  }

  interface DeleteSection {
    (idx: number): void;
  }

  const del: DeleteSection = (idx: number): void =>
    setSections(sections.filter((_, i: number) => i !== idx));

  interface DuplicateSection {
    (idx: number): void;
  }

  const dup: DuplicateSection = (idx: number): void => {
    console.log("dup");
    const copy: Section[] = structuredClone(sections);
    const clone: Section = { ...copy[idx], id: crypto.randomUUID() };
    copy.splice(idx + 1, 0, clone);
    setSections(copy);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        {sections.map((s, idx) => (
          <SectionCard
            key={s.id}
            onDuplicate={dup}
            section={s}
            index={idx}
            onEdit={onEdit}
            onDelete={del}
            picker={picker}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
