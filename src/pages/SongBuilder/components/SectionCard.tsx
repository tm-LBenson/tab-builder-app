import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import DragHandle from "./DragHandle";
import SectionMenu from "./SectionMenu";
import type { Section } from "./SectionList";
import type { PickerHook } from "../useChordPicker";

interface Props {
  section: Section;
  index: number;
  picker: PickerHook;
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
}

export default function SectionCard({
  section,
  index,
  picker,
  onEdit,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  /* click-outside to close menu */
  useEffect(() => {
    function close(e: MouseEvent) {
      if (!open) return;
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="space-y-1 border-t border-gray-700 pt-4 relative">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              {...listeners}
              className="mr-2 cursor-grab hover:text-blue-400 select-none"
              title="Drag section"
            >
              <DragHandle />
            </button>
            <h2 className="text-lg font-semibold text-red-400">
              {section.type}
            </h2>
          </div>

          {/* kebab menu */}
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-800"
            >
              ⋯
            </button>

            {open && (
              <SectionMenu
                open={open}
                setOpen={setOpen}
                onEdit={() => {
                  setOpen(false);
                  onEdit(index);
                }}
                onDelete={() => {
                  setOpen(false);
                  onDelete(index);
                }}
              />
            )}
          </div>
        </div>

        {section.lines.map((line, li) => (
          <div
            key={li}
            className="flex gap-1 flex-wrap mt-6"
          >
            {line.words.map((w, wi) => (
              <span
                key={wi}
                className="relative select-none"
              >
                {w.chord && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm text-blue-400">
                    {w.chord}
                  </span>
                )}
                <span
                  onClick={() => picker.handleWordClick(index, li, wi)}
                  className="px-1 cursor-pointer hover:bg-gray-700 rounded"
                >
                  {w.text}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
