import { useEffect, useState } from "react";
import SongCard, { type Song } from "./Songcard";
import { fetchPublicSongs } from "../../../lib/api";

export default function PublicSongsScroller() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchPublicSongs(10)
      .then(setSongs)
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-red-500">{err}</p>;
  if (!songs.length) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-red-400">
        Recent public songs
      </h2>
      <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-2">
        {songs.map((s) => (
          <SongCard
            key={s.id}
            song={s}
          />
        ))}
      </div>
    </section>
  );
}
