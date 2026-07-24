import Link from "next/link";

export default function CategoryGrid({ categories = [] }) {
  const safeCategories = Array.isArray(categories)
    ? categories
    : Array.isArray(categories?.categories)
      ? categories.categories
      : [];

  if (safeCategories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="font-display text-2xl sm:text-3xl text-brown mb-8 text-center">Featured categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {safeCategories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.slug}`}
            className="group relative aspect-[3/4] rounded-xl2 overflow-hidden bg-gradient-to-br from-brown/30 to-navy/40 shadow-softer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity group-hover:from-black/80" />
            <span className="absolute bottom-4 left-4 text-cream font-bold tracking-wide text-sm sm:text-base uppercase">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
