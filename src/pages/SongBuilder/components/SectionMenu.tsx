import { forwardRef } from "react";

interface Props {
  onEdit?: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const SectionMenu = forwardRef<HTMLDivElement, Props>(
  ({ onEdit, onDuplicate, onDelete }, ref) => (
    <div
      ref={ref}
      className="absolute right-0 mt-1 bg-gray-800 rounded shadow-lg z-10
                 min-w-[150px] py-1"
    >
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700
                     w-full text-left"
        >
          ✎ <span>Edit</span>
        </button>
      )}

      <button
        onClick={onDuplicate}
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700
                   w-full text-left"
      >
        📄 <span>Duplicate</span>
      </button>

      <button
        onClick={onDelete}
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700
                   w-full text-left text-red-400"
      >
        🗑 <span>Delete</span>
      </button>
    </div>
  ),
);

export default SectionMenu;
