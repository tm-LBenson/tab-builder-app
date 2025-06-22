import { auth } from "../firebase";

const base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8888";

async function headers(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) throw new Error("not authenticated");
  const token = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getSongs() {
  const res = await fetch(`${base}/songs`, { headers: await headers() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createSong(payload: {
  title: string;
  isPublic: boolean;
  payload: Record<string, unknown>;
}) {
  const res = await fetch(`${base}/songs`, {
    method: "POST",
    headers: await headers(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("not authenticated");
  return { Authorization: `Bearer ${token}` };
}

export async function deleteSong(id: string) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/songs/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function updateSong(id: string, body: Record<string, unknown>) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/songs/${id}`, {
    method: "PUT",
    headers: { ...(await authHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
}
