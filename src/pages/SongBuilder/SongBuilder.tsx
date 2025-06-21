import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSong } from "../../lib/api";
import ChordPicker from "./ChordPicker";

type SectionType = "Verse" | "Chorus" | "Bridge" | "Intro" | "Outro";
interface Word {
  text: string;
  chord?: string;
}
interface Line {
  words: Word[];
}
interface Section {
  id: string;
  type: SectionType;
  lines: Line[];
}

export default function SongBuilder() {
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [sections, setSections] = useState<Section[]>([]);

  const [draftType, setDraftType] = useState<SectionType>("Verse");
  const [draftText, setDraftText] = useState("");

  const [picker, setPicker] = useState<{
    s: number;
    l: number;
    w: number;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setError] = useState("");

  function addSection() {
    if (!draftText.trim()) return;

    const lines: Line[] = draftText
      .trim()
      .split("\n")
      .map((line) => ({
        words: line
          .trim()
          .split(/\s+/)
          .map((text) => ({ text })),
      }));

    setSections((sec) => [
      ...sec,
      { id: crypto.randomUUID(), type: draftType, lines },
    ]);

    setDraftText("");
  }

  function handleWordClick(s: number, l: number, w: number) {
    setPicker({ s, l, w });
  }

  function setChord(chord: string | null) {
    if (!picker) return;
    if (chord === null) chord = "";
    setSections((sec) => {
      const clone = structuredClone(sec);
      clone[picker.s].lines[picker.l].words[picker.w].chord = chord;
      return clone;
    });
  }

  async function saveSong() {
    setSaving(true);
    setError("");
    try {
      await createSong({
        title,
        isPublic: false,
        payload: {
          notes,
          sections,
        },
      });
      nav("/dashboard");
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message: unknown }).message === "string"
      ) {
        setError((err as { message: string }).message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 space-y-8">
      <div className=" lg:max-w-[900px] m-auto flex flex-col gap-5">
        <h1 className="text-3xl font-bold text-red-500">Song Builder</h1>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Song title"
          className="w-full bg-gray-800 px-3 py-2 rounded"
          required
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Song notes"
          className="w-full bg-gray-800 h-24 px-3 py-2 rounded resize-y"
        />

        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={draftType}
            onChange={(e) => setDraftType(e.target.value as SectionType)}
            className="bg-gray-800 px-2 py-1 rounded w-full md:w-32 shrink-0 h-[3rem]"
          >
            {["Verse", "Chorus", "Bridge", "Intro", "Outro"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="Paste lyrics for this section, one line per row…"
            className="flex-1 bg-gray-800 h-32 px-3 py-2 rounded resize-y"
          />

          <button
            onClick={addSection}
            className="h-12 px-4 bg-blue-600 rounded hover:bg-blue-500 shrink-0"
          >
            + Add section
          </button>
        </div>

        {sections.map((sec, sidx) => (
          <div
            key={sec.id}
            className="space-y-1"
          >
            <h2 className="text-lg font-semibold text-red-400 mb-5">
              {sec.type}
            </h2>
            {sec.lines.map((line, lidx) => (
              <div
                key={lidx}
                className="flex gap-1 flex-wrap mt-5"
              >
                {line.words.map((w, widx) => (
                  <span
                    key={widx}
                    className="relative select-none"
                  >
                    {w.chord && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-sm text-blue-400">
                        {w.chord}
                      </span>
                    )}
                    <span
                      onClick={() => handleWordClick(sidx, lidx, widx)}
                      className="px-1 cursor-pointer hover:bg-gray-700 rounded"
                    >
                      {w.text}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}

        {errorMsg && <p className="text-red-500">{errorMsg}</p>}

        <button
          onClick={saveSong}
          disabled={saving || !title || !sections.length}
          className="px-6 py-3 bg-red-600 rounded hover:bg-red-500 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save song"}
        </button>

        <ChordPicker
          open={!!picker}
          onClose={() => setPicker(null)}
          onSelect={setChord}
        />
      </div>
    </div>
  );
}
