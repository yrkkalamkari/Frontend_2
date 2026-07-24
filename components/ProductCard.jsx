"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { formatINR, effectivePrice, originalPrice, discountPercent, primaryImage, optimizedImage } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProductCard({ product, priority = false }) {
  const { toggleWishlist, addToCart, wishlist } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const isWishlisted = wishlist.some((w) => w.product?.id === product.id);
  const discount = discountPercent(product);

  function handleWishlist(e) {
    e.preventDefault();
    if (!user) return router.push("/profile");
    toggleWishlist(product); // optimistic — no await, UI updates instantly
  }

  function handleQuickAdd(e) {
    e.preventDefault();
    if (!user) return router.push("/profile");
    addToCart(product, 1); // optimistic — no await, UI updates instantly
  }

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative rounded-xl2 overflow-hidden bg-beige aspect-[3/4] shadow-softer group-hover:shadow-soft transition-shadow duration-300">
          <Image
            src={optimizedImage(primaryImage(product), 480)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
          />
          {discount && (
            <span className="absolute top-3 left-3 bg-brown text-cream text-xs font-semibold px-2 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
          <button
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart size={16} className={isWishlisted ? "fill-gold text-gold" : "text-brown/60"} />
          </button>
        </div>
        <div className="mt-3">
          <h3 className="text-sm font-medium text-brown line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-brown">{formatINR(effectivePrice(product))}</span>
            {originalPrice(product) && (
              <span className="text-xs text-brown/40 line-through">{formatINR(originalPrice(product))}</span>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={handleQuickAdd}
        disabled={product.stock === 0}
        className="mt-2 w-full bg-brown text-cream text-xs font-bold uppercase tracking-wide py-2.5 rounded-lg hover:bg-brownDark transition-colors disabled:opacity-40"
      >
        {product.stock === 0 ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
}
