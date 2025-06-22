export default function SectionMenu({
  open,
  setOpen,
  onEdit,
  onDelete,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!open) return null;
  return (
    <div className="absolute right-0 mt-1 bg-gray-800 rounded shadow-lg z-10 min-w-[120px] py-1">
      <button
        onClick={() => {
          setOpen(false);
          onEdit();
        }}
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full text-left"
      >
        ✎ <span>Edit</span>
      </button>
      <button
        onClick={() => {
          setOpen(false);
          onDelete();
        }}
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full text-left text-red-400"
      >
        🗑 <span>Delete</span>
      </button>
    </div>
  );
}
