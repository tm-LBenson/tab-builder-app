import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { deleteSong } from "../../../lib/api";
import ConfirmModal from "./ConfirmModal";

export interface Song {
  id: string;
  title: string;
}
interface Props {
  song: Song;
  onDeleted?: (id: string) => void;
}

function useOutside<T extends HTMLElement>(
  active: boolean,
  ref: React.RefObject<T>,
  cb: () => void,
) {
  useEffect(() => {
    if (!active) return;
    const h = (e: MouseEvent) =>
      !ref.current?.contains(e.target as Node) && cb();
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, [active, ref, cb]);
}

export default function SongCard({ song, onDeleted }: Props) {
  const nav = useNavigate();
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useOutside<HTMLDivElement>(menu, menuRef, () => setMenu(false));

  useEffect(() => {
    if (menu && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ x: r.right, y: r.bottom + 6 });
    }
  }, [menu]);

  async function handleDelete() {
    setBusy(true);
    try {
      await deleteSong(song.id);
      onDeleted?.(song.id);
    } finally {
      setBusy(false);
      setModal(false);
    }
  }

  return (
    <>
      <div
        onClick={() => nav(`/songs/${song.id}`)}
        className="relative min-w-[200px] bg-gray-800 p-4 rounded cursor-pointer"
      >
        {onDeleted && (
          <button
            ref={btnRef}
            onClick={(e) => {
              e.stopPropagation();
              setMenu((m) => !m);
            }}
            className="absolute top-1 right-1 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700"
          >
            ⋯
          </button>
        )}

        <h3 className="font-semibold">{song.title}</h3>
      </div>

      {menu &&
        createPortal(
          <div
            ref={menuRef}
            style={{ left: pos.x, top: pos.y }}
            onClick={(e) => e.stopPropagation()}
            className="fixed bg-gray-800 rounded shadow-lg z-50 min-w-[140px] py-1"
          >
            <button
              onClick={() => nav(`/songs/${song.id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full text-left text-white"
            >
              ✎ <span>Edit</span>
            </button>
            <button
              onClick={() => {
                setMenu(false);
                setModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full text-left text-red-400"
            >
              🗑 <span>Delete</span>
            </button>
          </div>,
          document.body,
        )}

      <ConfirmModal
        open={modal}
        busy={busy}
        title={song.title}
        onCancel={() => setModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
