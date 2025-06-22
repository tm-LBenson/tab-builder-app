import { auth } from "../firebase";

const base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8888";

async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("not authenticated");
  return { Authorization: `Bearer ${token}` };
}

async function jsonHeaders(): Promise<HeadersInit> {
  return { ...(await authHeaders()), "Content-Type": "application/json" };
}

export async function getMySongs() {
  const res = await fetch(`${base}/songs`, { headers: await authHeaders() });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getSong(id: string) {
  const res = await fetch(`${base}/songs/${id}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createSong(body: {
  title: string;
  isPublic: boolean;
  payload: Record<string, unknown>;
}) {
  const res = await fetch(`${base}/songs`, {
    method: "POST",
    headers: await jsonHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateSong(id: string, body: Record<string, unknown>) {
  const res = await fetch(`${base}/songs/${id}`, {
    method: "PUT",
    headers: await jsonHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteSong(id: string) {
  const res = await fetch(`${base}/songs/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function fetchPublicSongs(limit = 10) {
  const res = await fetch(`${base}/songs/public?limit=${limit}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
