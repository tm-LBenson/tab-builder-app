interface Props {
  busy: boolean;
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  busy,
  open,
  title,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-80 space-y-4">
        <h3 className="text-lg font-semibold text-red-400">
          Delete “{title}”?
        </h3>
        <p className="text-gray-300 text-sm">
          This can’t be undone. You’ll lose its chords &amp; lyrics.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            disabled={busy}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-500
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
