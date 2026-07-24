export function ProductCardSkeleton() {
  return (
    <div>
      <div className="relative rounded-xl2 overflow-hidden bg-beige aspect-[3/4]">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      </div>
      <div className="mt-3 h-3 w-3/4 bg-beige rounded" />
      <div className="mt-2 h-3 w-1/3 bg-beige rounded" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
