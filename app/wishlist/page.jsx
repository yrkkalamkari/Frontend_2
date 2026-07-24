"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatINR, effectivePrice, primaryImage } from "@/lib/format";
import EmptyState from "@/components/EmptyState";

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, toggleWishlist, addToCart } = useCart();

  if (!user) return <EmptyState icon="❤️" title="Sign in to view your wishlist" ctaLabel="Sign in" ctaHref="/profile" />;
  if (wishlist.length === 0) {
    return <EmptyState icon="❤️" title="Save your favorite items" subtitle="Items you love will show up here" ctaLabel="Browse products" ctaHref="/products" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-brown mb-8">Your wishlist</h1>
      <div className="columns-2 md:columns-4 gap-4 space-y-4">
        {wishlist.map((item) => (
          <div key={item.id} className="break-inside-avoid bg-white rounded-xl2 shadow-softer overflow-hidden">
            <Link href={`/products/${item.product.slug}`} className="relative block aspect-[3/4]">
              <Image src={primaryImage(item.product)} alt={item.product.name} fill className="object-cover" />
            </Link>
            <div className="p-3">
              <h3 className="text-sm font-medium text-brown line-clamp-1">{item.product.name}</h3>
              <p className="text-sm font-semibold text-brown mt-1">{formatINR(effectivePrice(item.product))}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => addToCart(item.product, 1)}
                  className="flex-1 bg-brown text-cream text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-gold transition-colors"
                >
                  <ShoppingBag size={14} /> Move to cart
                </button>
                <button
                  onClick={() => toggleWishlist(item.product)}
                  className="w-9 h-9 rounded-lg border border-brown/15 flex items-center justify-center text-brown/50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
