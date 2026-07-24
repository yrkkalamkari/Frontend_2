"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Heart } from "lucide-react";
import { formatINR, effectivePrice, originalPrice, discountPercent, optimizedImage } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useProduct } from "@/lib/hooks";

const ACCORDION_SECTIONS = [
  { key: "description", label: "Description" },
  { key: "fabric", label: "Fabric & care" },
  { key: "shipping", label: "Shipping" },
  { key: "returns", label: "Returns" },
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, toggleWishlist, wishlist } = useCart();

  const { product, isLoading } = useProduct(slug);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState("description");

  if (isLoading && !product) return <div className="max-w-7xl mx-auto px-6 py-16 text-brown/50">Loading…</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-6 py-16 text-brown/50">Product not found.</div>;

  const images = product.images?.length ? product.images : [{ url: "/icons/icon-512.png" }];
  const isWishlisted = wishlist.some((w) => w.product?.id === product.id);
  const discount = discountPercent(product);

  function handleAddToCart() {
    if (!user) return router.push("/profile");
    addToCart(product, qty); // optimistic — instant feedback, no await
  }

  async function handleBuyNow() {
    if (!user) return router.push("/profile");
    await addToCart(product, qty); // await here since we navigate right after
    router.push("/cart");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
      {/* Gallery */}
      <div>
        <div className="relative aspect-[3/4] rounded-xl2 overflow-hidden bg-beige shadow-soft">
          <Image src={optimizedImage(images[activeImage].url, 900)} alt={product.name} fill className="object-cover" priority />
          {discount && (
            <span className="absolute top-4 left-4 bg-brown text-cream text-xs font-semibold px-3 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-3 mt-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 ${
                  i === activeImage ? "border-gold" : "border-transparent"
                }`}
              >
                <Image src={optimizedImage(img.url, 100)} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <p className="text-xs text-brown/50 uppercase tracking-wide">{product.category?.name}</p>
        <h1 className="font-display text-3xl text-brown mt-2">{product.name}</h1>

        <div className="flex items-center gap-3 mt-4">
          <span className="text-2xl font-semibold text-brown">{formatINR(effectivePrice(product))}</span>
          {originalPrice(product) && (
            <span className="text-base text-brown/40 line-through">{formatINR(originalPrice(product))}</span>
          )}
          {discount && <span className="text-sm text-green-700 font-medium">You save {discount}%</span>}
        </div>

        <p className={`mt-3 text-sm font-medium ${product.stock > 0 ? "text-green-700" : "text-red-600"}`}>
          {product.stock > 0 ? `In stock (${product.stock} left)` : "Out of stock"}
        </p>

        <div className="flex items-center gap-3 mt-6">
          <div className="flex items-center border border-brown/15 rounded-xl2">
            <button className="px-4 py-2 text-brown/70" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="px-4 py-2 text-brown font-medium">{qty}</span>
            <button className="px-4 py-2 text-brown/70" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
          </div>
          <button
            onClick={() => toggleWishlist(product)}
            className="w-11 h-11 rounded-xl2 border border-brown/15 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Heart size={18} className={isWishlisted ? "fill-gold text-gold" : "text-brown/60"} />
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="flex-1 bg-brown text-cream py-4 rounded-xl2 font-semibold hover:bg-gold transition-colors disabled:opacity-40"
          >
            Buy now
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 border-2 border-brown text-brown py-4 rounded-xl2 font-semibold hover:bg-beige transition-colors disabled:opacity-40"
          >
            Add to cart
          </button>
        </div>

        {/* Accordion */}
        <div className="mt-10 divide-y divide-brown/10 border-t border-b border-brown/10">
          {ACCORDION_SECTIONS.map((s) => (
            <div key={s.key}>
              <button
                onClick={() => setOpenSection(openSection === s.key ? null : s.key)}
                className="w-full flex justify-between items-center py-4 text-left font-medium text-brown"
              >
                {s.label}
                <span>{openSection === s.key ? "−" : "+"}</span>
              </button>
              {openSection === s.key && (
                <p className="pb-4 text-sm text-brown/60">
                  {s.key === "description" && product.description}
                  {s.key === "fabric" && (product.fabricType || "Cotton — hand wash cold, dry in shade.")}
                  {s.key === "shipping" && "Dispatched within 2-3 business days. Free shipping above ₹999."}
                  {s.key === "returns" && "7-day easy returns on unworn, unwashed items with tags attached."}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-cream border-t border-brown/10 p-4 flex gap-3 z-40">
        <button onClick={handleBuyNow} className="flex-1 bg-brown text-cream py-3 rounded-xl2 font-semibold">
          Buy now
        </button>
        <button onClick={handleAddToCart} className="flex-1 border-2 border-brown text-brown py-3 rounded-xl2 font-semibold">
          Add to cart
        </button>
      </div>
    </div>
  );
}
