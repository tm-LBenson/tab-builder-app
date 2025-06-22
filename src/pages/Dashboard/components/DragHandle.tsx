export default function DragHandle({
  className = "w-[22px] h-[16px]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 22 16"
      className={`${className} fill-current`}
      aria-hidden="true"
    >
      <path d="M12 1 L15 4 H9 Z" />

      {[5, 10, 15, 20].map((x) =>
        [6, 10].map((y, i) => (
          <circle
            key={`${x}-${i}`}
            cx={x}
            cy={y}
            r="1.1"
          />
        )),
      )}

      <path d="M12 15 L9 12 H15 Z" />
    </svg>
  );
}
