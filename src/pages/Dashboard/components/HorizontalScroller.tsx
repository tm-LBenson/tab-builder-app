import { useState } from "react";
import type { Song } from "./Songcard";
import SongCard from "./Songcard";

interface Props {
  title: string;
  songs: Song[];
}

export default function HorizontalScroller({ title, songs }: Props) {
  const [list, setList] = useState<Song[]>(songs);

  if (!list.length) return null;

  function remove(id: string) {
    setList((ls) => ls.filter((s) => s.id !== id));
  }

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-red-400">{title}</h2>

      <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-2">
        {list.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onDeleted={remove}
          />
        ))}
      </div>
    </section>
  );
}
