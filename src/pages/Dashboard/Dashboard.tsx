import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";

import SongList from "./components/SongList";
import NewsSection from "./components/NewsSection";

interface NewsItem {
  id: string;
  title: string;
  url: string;
}

async function fetchNews(): Promise<NewsItem[]> {
  // TODO: swap this for a real endpoint / RSS feed
  return [
    { id: "1", title: "Welcome to TabVault!", url: "#" },
    { id: "2", title: "New sharing features released", url: "#" },
  ];
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [view, setView] = useState<"full" | "libraryOnly">("full");

  useEffect(() => {
    if (isAuthenticated) fetchNews().then(setNews);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-10 space-y-10">
      <header className="flex justify-between items-center">
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

      <SongList />
      <SongList />
      {view === "full" && <NewsSection items={news} />}
    </div>
  );
}
