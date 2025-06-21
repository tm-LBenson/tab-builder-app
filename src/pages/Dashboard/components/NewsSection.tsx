interface NewsItem {
  id: string;
  title: string;
  url: string;
}

export default function NewsSection({ items }: { items: NewsItem[] }) {
  if (!items.length) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-red-400">News</h2>
      <ul className="space-y-2 list-disc list-inside">
        {items.map((n) => (
          <li key={n.id}>
            <a
              href={n.url}
              className="text-blue-400 hover:text-blue-200"
            >
              {n.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
