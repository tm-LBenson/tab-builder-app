import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";

import { getMySongs, fetchPublicSongs } from "../../lib/api";

import HorizontalScroller from "./components/HorizontalScroller";
import NewsSection from "./components/NewsSection";

interface Song {
  id: string;
  title: string;
  ownerUid?: string;
  public: boolean;
  payload?: Record<string, unknown>;
}

interface NewsItem {
  id: string;
  title: string;
  url: string;
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  const [library, setLibrary] = useState<Song[]>([]);
  const [publicSongs, setPublic] = useState<Song[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [view, setView] = useState<"full" | "libraryOnly">("full");

  useEffect(() => {
    if (!isAuthenticated) return;
    getMySongs().then(setLibrary).catch(console.error);
    fetchPublicSongs(10).then(setPublic).catch(console.error);
    fakeNews().then(setNews);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-10">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-red-500">Dashboard</h1>
        <button
          onClick={() =>
            setView((v) => (v === "full" ? "libraryOnly" : "full"))
          }
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          {view === "full" ? "My library" : "Show all"}
        </button>
      </header>

      {view === "full" && <NewsSection items={news} />}

      <HorizontalScroller
        title={view === "libraryOnly" ? "My Songs" : "My Library"}
        songs={library}
      />

      {view === "full" && (
        <HorizontalScroller
          title="New Public Songs"
          songs={publicSongs}
        />
      )}
    </div>
  );
}

async function fakeNews(): Promise<NewsItem[]> {
  return [
    { id: "1", title: "Welcome to Song Vault!", url: "#" },
    { id: "2", title: "New sharing features released", url: "#" },
  ];
}
