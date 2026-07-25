import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import ArtisansSection from "@/components/ArtisansSection";
import USPStrip from "@/components/USPStrip";
import FeaturesAndPromo from "@/components/FeaturesAndPromo";
import { api } from "@/lib/api";

async function getHomeData() {
  const [bestSellersResult, recentResult] = await Promise.all([
    api.products({ limit: 5, sort: "price_desc" }, { cache: "no-store" }),
    api.products({ limit: 4, sort: "newest" }, { cache: "no-store" }),
  ]);

  const bestSellers = Array.isArray(bestSellersResult?.products) ? bestSellersResult.products.filter(Boolean) : [];
  const recent = Array.isArray(recentResult?.products) ? recentResult.products.filter(Boolean) : [];

  return { bestSellers, recent };
}

export default async function HomePage() {
  const { bestSellers, recent } = await getHomeData();

  return (
    <>
      <Hero />
      <USPStrip />
      <TrustBadges />
      <CategoryGrid />

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl sm:text-3xl text-brown mb-1 text-center">Best sellers</h2>
        <p className="text-center text-brown/50 text-sm mb-8">{bestSellers.length} products</p>
        <div className="overflow-x-auto pb-4 sm:px-2 lg:px-0">
          <div className="flex gap-4 min-w-max">
            {bestSellers.map((p, i) => (
              <div key={p.id} className="min-w-[260px] flex-shrink-0">
                <ProductCard product={p} priority={i < 4} />
              </div>
            ))}
          </div>
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