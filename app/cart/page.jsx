"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatINR, effectivePrice, primaryImage } from "@/lib/format";
import { api } from "@/lib/api";
import EmptyState from "@/components/EmptyState";

export default function CartPage() {
  const { user } = useAuth();
  const { cart, cartTotal, updateQty, removeFromCart, refreshCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [couponError, setCouponError] = useState("");

  if (!user) {
    return <EmptyState icon="🛒" title="Sign in to view your cart" ctaLabel="Sign in" ctaHref="/profile" />;
  }

  if (cart.length === 0) {
    return <EmptyState icon="🛒" title="Your cart is empty" ctaLabel="Shop now" ctaHref="/products" />;
  }

  async function applyCoupon() {
    setCouponError("");
    try {
      const result = await api.validateCoupon(couponCode.toUpperCase(), cartTotal);
      setCouponResult(result);
    } catch (err) {
      setCouponResult(null);
      setCouponError(err.message);
    }
  }

  const discount = couponResult?.discount || 0;
  const total = cartTotal - discount;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-[1fr_360px] gap-10">
      {/* Items */}
      <div className="space-y-6">
        <h1 className="font-display text-2xl text-brown">Your cart</h1>
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white rounded-xl2 shadow-softer p-4">
            <div className="relative w-24 h-28 rounded-lg overflow-hidden bg-beige shrink-0">
              <Image src={primaryImage(item.product)} alt={item.product.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-brown">{item.product.name}</h3>
              <p className="text-sm text-brown/60 mt-1">{formatINR(effectivePrice(item.product))}</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center border border-brown/15 rounded-lg">
                  <button className="px-3 py-1 text-brown/70" onClick={() => updateQty(item.productId, Math.max(1, item.qty - 1))}>−</button>
                  <span className="px-3 py-1 text-sm">{item.qty}</span>
                  <button className="px-3 py-1 text-brown/70" onClick={() => updateQty(item.productId, item.qty + 1)}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="text-brown/40 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="font-semibold text-brown">{formatINR(effectivePrice(item.product) * item.qty)}</div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-beige rounded-xl2 p-6 h-fit sticky top-24">
        <h2 className="font-display text-xl text-brown mb-4">Order summary</h2>

        <div className="flex gap-2 mb-4">
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Coupon code"
            className="flex-1 px-3 py-2 rounded-lg border border-brown/10 text-sm bg-white"
          />
          <button onClick={applyCoupon} className="px-4 py-2 bg-brown text-cream rounded-lg text-sm font-semibold hover:bg-gold transition-colors">
            Apply
          </button>
        </div>
        {couponResult && (
          <p className="text-sm text-green-700 mb-3">✓ {couponResult.code} applied — you saved {formatINR(discount)}</p>
        )}
        {couponError && <p className="text-sm text-red-600 mb-3">{couponError}</p>}

        <div className="space-y-2 text-sm text-brown/70 border-t border-brown/10 pt-4">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(cartTotal)}</span></div>
          {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>−{formatINR(discount)}</span></div>}
          <div className="flex justify-between font-semibold text-brown text-base pt-2 border-t border-brown/10">
            <span>Total</span><span>{formatINR(total)}</span>
          </div>
        </div>

        <Link
          href={{ pathname: "/checkout", query: couponResult ? { coupon: couponResult.code } : {} }}
          className="block text-center mt-6 bg-brown text-cream py-4 rounded-xl2 font-semibold hover:bg-gold transition-colors"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
