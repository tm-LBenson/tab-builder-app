import SongCard from "./Songcard";
import type { Song } from "./Songcard";
interface Props {
  title: string;
  songs: Song[];
}

export default function HorizontalScroller({ title, songs }: Props) {
  if (!songs.length) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-red-400">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
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
