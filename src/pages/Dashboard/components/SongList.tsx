import { useEffect, useState } from "react";

import HorizontalScroller from "./HorizontalScroller";
import { getMySongs } from '../../../lib/api';

interface Song {
  id: string;
  title: string;
  public: boolean;
  ownerUid?: string;
  updated: string;
  payload: Record<string, unknown>;
}

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    getMySongs()
      .then((s) => setSongs(s || []))
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-red-500">{err}</p>;
  if (!songs.length) return <p className="text-gray-400">No songs yet.</p>;

  return (
    <HorizontalScroller
      title="My Songs"
      songs={songs}
    />
  );
}
