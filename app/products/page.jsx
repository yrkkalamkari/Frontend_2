"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";
import { useCategories, useInfiniteProducts } from "@/lib/hooks";

function ProductListing() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const search = searchParams.get("search") || "";

  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  // Debounced values — these are what actually trigger a request, so typing
  // "1500" doesn't fire 4 separate API calls, just one ~400ms after you stop.
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setMinPrice(minPriceInput);
      setMaxPrice(maxPriceInput);
    }, 400);
    return () => clearTimeout(t);
  }, [minPriceInput, maxPriceInput]);

  const { categories } = useCategories();
  const { products, isLoading, isLoadingMore, hasMore, loadMore } = useInfiniteProducts({
    category, sort, search, minPrice, maxPrice, limit: 12,
  });

  // Loads the next page automatically once the sentinel scrolls into view —
  // browsing feels continuous instead of "click page 2, wait, re-render."
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" } // start loading before the user hits the bottom
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-brown mb-8 capitalize">
        {category || "All products"}
      </h1>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        {/* Filters */}
        <aside className="hidden md:block space-y-8 sticky top-24 self-start">
          <div>
            <h3 className="font-semibold text-brown text-sm mb-3">Category</h3>
            <ul className="space-y-2 text-sm text-brown/70">
              <li>
                <button onClick={() => updateParam("category", "")} className={!category ? "text-gold font-semibold" : ""}>
                  All
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => updateParam("category", c.slug)}
                    className={category === c.slug ? "text-gold font-semibold" : ""}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-brown text-sm mb-3">Price range</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-brown/10"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-brown/10"
              />
            </div>
          </div>
        </aside>

        {/* Products */}
        <div>
          <div className="mb-6 space-y-4">
          {categories.length > 0 && (
            <div className="overflow-x-auto pb-2">
              <div className="inline-flex gap-2">
                <button
                  onClick={() => updateParam("category", "")}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${!category ? "bg-brown text-cream" : "bg-brown/10 text-brown"}`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateParam("category", c.slug)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${category === c.slug ? "bg-brown text-cream" : "bg-brown/10 text-brown"}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="text-sm border border-brown/10 rounded-lg px-3 py-2 bg-white"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>
        </div>

          {isLoading ? (
            <ProductGridSkeleton count={9} />
          ) : products.length === 0 ? (
            <EmptyState icon="🔍" title="No products found" subtitle="Try adjusting your filters" />
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 6} />
                ))}
              </div>

              {/* Invisible sentinel — triggers the next page load when scrolled into view */}
              <div ref={sentinelRef} className="h-1" />

              {isLoadingMore && (
                <div className="mt-6">
                  <ProductGridSkeleton count={3} />
                </div>
              )}
              {!hasMore && products.length > 0 && (
                <p className="text-center text-brown/40 text-sm mt-10">You've reached the end</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10"><ProductGridSkeleton count={9} /></div>}>
      <ProductListing />
    </Suspense>
  );
}
