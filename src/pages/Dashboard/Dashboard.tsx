import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
} from "firebase/firestore";
import HorizontalScroller from "./components/HorizontalScroller";
import NewsSection from "./components/NewsSection";
import { useAuth } from "../../context/useAuth";

interface Song {
  id: string;
  title: string;
  ownerId: string;
  public: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  url: string;
}

async function fetchLibrary(uid: string): Promise<Song[]> {
  const q = query(collection(db, "songs"), where("ownerId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Song), id: d.id }));
}

async function fetchPublic(): Promise<Song[]> {
  const q = query(
    collection(db, "songs"),
    where("public", "==", true),
    orderBy("createdAt", "desc"),
    limit(20),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Song), id: d.id }));
}

async function fetchNews(): Promise<NewsItem[]> {
  // TODO: replace with real endpoint / RSS feed
  return [
    { id: "1", title: "Welcome to TabVault!", url: "#" },
    { id: "2", title: "New sharing features released", url: "#" },
  ];
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [library, setLibrary] = useState<Song[]>([]);
  const [publicSongs, setPublicSongs] = useState<Song[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [view, setView] = useState<"full" | "libraryOnly">("full");

  useEffect(() => {
    if (!isAuthenticated) return;
    interface FirebaseWindow extends Window {
      firebase?: {
        auth?: {
          currentUser?: {
            uid?: string;
          };
        };
      };
    }
    const uid =
      (window as FirebaseWindow).firebase?.auth?.currentUser?.uid ?? null;
    if (!uid) return;

    fetchLibrary(uid).then(setLibrary);
    fetchPublic().then(setPublicSongs);
    fetchNews().then(setNews);
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
