import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSong, createSong, updateSong } from "../../lib/api";
import type { Section } from "./components/SectionList";
import useChordPicker from "./useChordPicker";
import ComposerPanel from "./components/ComposerPanel";
import SectionList from "./components/SectionList";
type SongResponse = {
  title: string;
  isPublic?: boolean;
  IsPublic?: boolean;
  payload?: {
    notes?: string;
    sections?: Section[];
  };
};
export default function SongBuilder() {
  const { id } = useParams();
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const picker = useChordPicker(sections, setSections);

  useEffect(() => {
    if (!id) return;
    getSong(id)
      .then((s) => {
        setTitle(s.title);
        setNotes(s.payload?.notes ?? "");
        setIsPublic(
          Boolean((s as SongResponse).isPublic ?? (s as SongResponse).IsPublic),
        );
        setSections(s.payload?.sections ?? []);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  async function saveSong() {
    setSaving(true);
    try {
      const body = { title, isPublic, payload: { notes, sections } };
      if (id) {
        await updateSong(id, body);
      } else {
        await createSong(body);
      }
      nav("/dashboard");
    } catch (e: unknown) {
      if (
        e &&
        typeof e === "object" &&
        "message" in e &&
        typeof (e as { message?: unknown }).message === "string"
      ) {
        setError((e as { message: string }).message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 space-y-8">
      <div className="max-w-[900px] mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-red-500">Song Builder</h1>

        <ComposerPanel
          title={title}
          onTitle={setTitle}
          notes={notes}
          onNotes={setNotes}
          isPublic={isPublic}
          onPublic={setIsPublic}
          addSection={(s) => setSections((arr) => [...arr, s])}
        />

        <SectionList
          sections={sections}
          setSections={setSections}
          picker={picker}
        />

        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={saveSong}
          disabled={saving || !title || !sections.length}
          className="px-6 py-3 bg-red-600 rounded hover:bg-red-500 disabled:opacity-50"
        >
          {saving ? "Saving…" : id ? "Update song" : "Save song"}
        </button>
      </div>

      {picker.node}
    </div>
  );
}
