/* src/pages/Builder/components/ComposerPanel.tsx */
import { useState, useEffect } from "react";
import type { Section, SectionType } from "./SectionList";

interface Props {
  title: string;
  onTitle: (t: string) => void;
  notes: string;
  onNotes: (n: string) => void;
  isPublic: boolean;
  onPublic: (v: boolean) => void;
  addSection: (s: Section) => void;

  draftSection: Section | null;
  clearDraft: () => void;
}

export default function ComposerPanel({
  title,
  onTitle,
  notes,
  onNotes,
  isPublic,
  onPublic,
  addSection,
  draftSection,
  clearDraft,
}: Props) {
  const [draftType, setDraftType] = useState<SectionType>("Verse");
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    if (!draftSection) return;
    setDraftType(draftSection.type);
    interface Word {
      text: string;
    }

    interface Line {
      words: Word[];
    }

    const text: string = draftSection.lines
      .map((l: Line) => l.words.map((w: Word) => w.text).join(" "))
      .join("\n");
    setDraftText(text);
  }, [draftSection]);

  const textToLines = (txt: string) =>
    txt
      .trim()
      .split("\n")
      .map((line) => ({
        words: line
          .trim()
          .split(/\s+/)
          .map((text) => ({ text })),
      }));

  function handleSave() {
    if (!draftText.trim()) return;

    const newSection: Section = {
      id: draftSection ? draftSection.id : crypto.randomUUID(),
      type: draftType,
      lines: textToLines(draftText),
    };

    addSection(newSection);
    resetForm();
  }

  function resetForm() {
    setDraftText("");
    setDraftType("Verse");
    clearDraft();
  }

  const buttonLabel = draftSection ? "Save" : "+ Add";

  return (
    <>
      <input
        value={title}
        onChange={(e) => onTitle(e.target.value)}
        placeholder="Song title"
        className="w-full bg-gray-800 px-3 py-2 rounded"
        required
      />
      <textarea
        value={notes}
        onChange={(e) => onNotes(e.target.value)}
        placeholder="Song notes"
        className="w-full bg-gray-800 h-24 px-3 py-2 rounded resize-y"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => onPublic(e.target.checked)}
        />
        <span className="text-sm">Public</span>
      </label>

      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={draftType}
          onChange={(e) => setDraftType(e.target.value as SectionType)}
          className="bg-gray-800 px-2 py-1 rounded w-full md:w-32 h-[3rem]"
        >
          {["Verse", "Chorus", "Bridge", "Intro", "Outro"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <textarea
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          placeholder="Lyrics for this section…"
          className="flex-1 bg-gray-800 h-32 px-3 py-2 rounded resize-y"
        />

        <button
          onClick={handleSave}
          className="h-12 px-4 bg-blue-600 rounded hover:bg-blue-500 shrink-0"
        >
          {buttonLabel}
        </button>
      </div>
    </>
  );
}
