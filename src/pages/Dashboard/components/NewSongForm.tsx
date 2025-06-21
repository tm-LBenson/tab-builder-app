import { useState } from "react";
import { createSong } from "../../../lib/api";

interface Props {
  onCreated?: () => void;
}

export default function NewSongForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createSong({
        title,
        isPublic,
        payload: { lyrics }, // ← payload now matches schema exactly
      });

      /* reset form */
      setTitle("");
      setLyrics("");
      setIsPublic(false);
      onCreated?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-800 p-6 rounded-lg"
    >
      <h2 className="text-xl font-semibold text-red-400">New Song</h2>

      <input
        type="text"
        placeholder="Song title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 bg-gray-700 rounded"
        required
      />

      <textarea
        placeholder="Paste lyrics (optional)"
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        className="w-full h-28 px-3 py-2 bg-gray-700 rounded resize-y"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        Make public
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Create"}
      </button>
    </form>
  );
}
