import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSong, getSongs, updateSong } from "../../lib/api";
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
  const { id } = useParams();
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const [sections, setSections] = useState<Section[]>([]);

  const [draftType, setDraftType] = useState<SectionType>("Verse");
  const [draftText, setDraftText] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const [menuIdx, setMenuIdx] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [picker, setPicker] = useState<{
    s: number;
    l: number;
    w: number;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getSongs()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((songs: any[]) => {
        const data = songs.find((song) => song.id === id);
        if (!data) throw new Error("Song not found");
        setTitle(data.title);
        setNotes(data.payload?.notes ?? "");
        setSections(data.payload?.sections ?? []);
      })
      .catch((e: Error) => setError(e.message));
  }, [id]);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (menuIdx === null) return;
      if (!menuRef.current?.contains(e.target as Node)) setMenuIdx(null);
    }
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [menuIdx]);

  const textToLines = (txt: string): Line[] =>
    txt
      .trim()
      .split("\n")
      .map((line) => ({
        words: line
          .trim()
          .split(/\s+/)
          .map((text) => ({ text })),
      }));

  const linesToText = (ls: Line[]): string =>
    ls.map((l) => l.words.map((w) => w.text).join(" ")).join("\n");

  function mergeChords(oldS: Section, newS: Section): Section {
    const merged = structuredClone(newS);
    oldS.lines.forEach((oldLine, li) => {
      if (li >= merged.lines.length) return;
      oldLine.words.forEach((oldWord, wi) => {
        if (wi >= merged.lines[li].words.length) return;
        const newWord = merged.lines[li].words[wi];
        if (oldWord.text === newWord.text) newWord.chord = oldWord.chord;
      });
    });
    return merged;
  }

  function saveSection() {
    if (!draftText.trim()) return;

    const sec: Section = {
      id: editIdx === null ? crypto.randomUUID() : sections[editIdx].id,
      type: draftType,
      lines: textToLines(draftText),
    };

    setSections((prev) => {
      const clone = [...prev];
      if (editIdx === null) clone.push(sec);
      else clone[editIdx] = mergeChords(clone[editIdx], sec);
      return clone;
    });
    clearDraft();
  }

  function clearDraft() {
    setDraftText("");
    setDraftType("Verse");
    setEditIdx(null);
  }

  function handleEdit(idx: number) {
    const s = sections[idx];
    setDraftType(s.type);
    setDraftText(linesToText(s.lines));
    setEditIdx(idx);
    setMenuIdx(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(idx: number) {
    setSections((sec) => sec.filter((_, i) => i !== idx));
    if (editIdx !== null && idx === editIdx) clearDraft();
    setMenuIdx(null);
  }

  function handleWordClick(s: number, l: number, w: number) {
    setPicker({ s, l, w });
  }
  function setChord(chord: string | null) {
    if (!picker) return;
    setSections((prev) => {
      const clone = structuredClone(prev);
      clone[picker.s].lines[picker.l].words[picker.w].chord =
        chord || undefined;
      return clone;
    });
  }

  async function saveSong() {
    setSaving(true);
    setError("");
    try {
      const body = { title, isPublic: false, payload: { notes, sections } };
      if (id) {
        await updateSong(id, body);
      } else {
        await createSong(body);
      }
      nav("/dashboard");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 space-y-8">
      <div className="lg:max-w-[900px] mx-auto flex flex-col gap-6">
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
            onClick={saveSection}
            className="h-12 px-4 bg-blue-600 rounded hover:bg-blue-500 shrink-0"
          >
            {editIdx === null ? "+ Add" : "Save"}
          </button>
        </div>

        {sections.map((sec, sidx) => (
          <div
            key={sec.id}
            className="space-y-1 border-t border-gray-700 pt-4 relative"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-red-400">{sec.type}</h2>

              <div className="relative">
                <button
                  onClick={() => setMenuIdx(menuIdx === sidx ? null : sidx)}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-800"
                >
                  ⋯
                </button>

                {menuIdx === sidx && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-1 bg-gray-800 rounded shadow-lg z-10 min-w-[120px] py-1"
                  >
                    <button
                      onClick={() => handleEdit(sidx)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full text-left"
                    >
                      ✎ <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(sidx)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full text-left text-red-400"
                    >
                      🗑 <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {sec.lines.map((line, lidx) => (
              <div
                key={lidx}
                className="flex gap-1 flex-wrap mt-6"
              >
                {line.words.map((w, widx) => (
                  <span
                    key={widx}
                    className="relative select-none"
                  >
                    {w.chord && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm text-blue-400">
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

        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={saveSong}
          disabled={saving || !title || !sections.length}
          className="px-6 py-3 bg-red-600 rounded hover:bg-red-500 disabled:opacity-50"
        >
          {saving ? "Saving…" : id ? "Update song" : "Save song"}
        </button>
      </div>

      <ChordPicker
        open={!!picker}
        onClose={() => setPicker(null)}
        onSelect={setChord}
      />
    </div>
  );
}
