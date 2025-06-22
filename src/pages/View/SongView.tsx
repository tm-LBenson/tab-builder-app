import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMySongs } from '../../lib/api';

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

interface SongRes {
  id: string;
  title: string;
  payload: {
    notes?: string;
    sections: Section[];
  };
}

export default function SongView() {
  const { id } = useParams();
  const [song, setSong] = useState<SongRes | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    getMySongs()
      .then((songs: SongRes[]) => {
        const found = songs.find((s) => s.id === id);
        if (!found) throw new Error("Song not found");
        setSong(found);
      })
      .catch((e: Error) => setErr(e.message));
  }, [id]);

  if (err) return <p className="text-red-500 p-6">{err}</p>;
  if (!song) return <p className="p-6 text-gray-300">Loading…</p>;

  const { title, payload } = song;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 print:p-2">
      <div className="max-w-5xl mx-auto space-y-8 print:space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-red-400 print:text-black">
            {title}
          </h1>
          <Link
            to={`/songs/${id}/edit`}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500
                       print:hidden"
          >
            ✎ Edit
          </Link>
        </header>

        {payload.notes?.trim() && (
          <section className="bg-gray-800 p-4 rounded print:bg-transparent">
            <h2 className="text-lg font-semibold mb-2 text-red-300 print:text-black">
              Notes
            </h2>
            <pre className="whitespace-pre-wrap font-sans text-gray-200 print:text-black">
              {payload.notes}
            </pre>
          </section>
        )}

        {payload.sections.map((sec) => (
          <section
            key={sec.id}
            className="flex gap-6 print:gap-3"
          >
            <div className="w-24 shrink-0 text-right pr-2">
              <p className="text-red-400 font-semibold print:text-black">
                {sec.type}
              </p>
            </div>

            <div className="flex-1 space-y-4 print:space-y-2">
              {sec.lines.map((line, li) => (
                <div
                  key={li}
                  className="flex gap-2 flex-wrap"
                >
                  {line.words.map((w, wi) => (
                    <span
                      key={wi}
                      className="relative select-none"
                    >
                      {w.chord && (
                        <span
                          className="absolute -top-5 left-1/2 -translate-x-1/2
                                     text-sm text-blue-400 font-medium
                                     print:text-black print:font-semibold"
                        >
                          {w.chord}
                        </span>
                      )}
                      <span className="px-1">{w.text}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <style>
        {`
          @media print {
            body { background:white; }
            .print\\:hidden { display:none !important }
            .print\\:text-black { color:#000 !important }
            .print\\:bg-transparent { background:transparent !important }
            .print\\:space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top:1rem }
            .print\\:p-2 { padding:0.5rem !important }
          }
        `}
      </style>
    </div>
  );
}
