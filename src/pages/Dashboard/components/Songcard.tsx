import { Link } from "react-router-dom";

export interface Song {
  id: string;
  title: string;
}

export default function SongCard({ song }: { song: Song }) {
  return (
    <Link
      to={`/song/${song.id}`}
      className="w-48 shrink-0 bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition"
    >
      <h3 className="text-lg font-semibold text-blue-400 truncate">
        {song.title}
      </h3>
    </Link>
  );
}
