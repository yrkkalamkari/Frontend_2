import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import ArtisansSection from "@/components/ArtisansSection";
import USPStrip from "@/components/USPStrip";
import FeaturesAndPromo from "@/components/FeaturesAndPromo";
import { api } from "@/lib/api";

async function getHomeData() {
  const [categoriesResult, bestSellersResult, recentResult] = await Promise.all([
    api.categories(),
    api.products({ limit: 5, sort: "price_desc" }),
    api.products({ limit: 4, sort: "newest" }),
  ]);

  const categories = Array.isArray(categoriesResult)
    ? categoriesResult
    : Array.isArray(categoriesResult?.categories)
      ? categoriesResult.categories
      : [];

  const bestSellers = Array.isArray(bestSellersResult?.products) ? bestSellersResult.products.filter(Boolean) : [];
  const recent = Array.isArray(recentResult?.products) ? recentResult.products.filter(Boolean) : [];

  return { categories, bestSellers, recent };
}

export default async function HomePage() {
  const { categories, bestSellers, recent } = await getHomeData();

  return (
    <>
      <Hero />
      <USPStrip />
      <TrustBadges />
      <CategoryGrid categories={categories} />

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl sm:text-3xl text-brown mb-1 text-center">Best sellers</h2>
        <p className="text-center text-brown/50 text-sm mb-8">{bestSellers.length} products</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      </section>

      <ArtisansSection />

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl sm:text-3xl text-brown mb-8 text-center">Recent arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {recent.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <FeaturesAndPromo />
    </>
  );
}