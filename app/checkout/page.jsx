"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useAddresses, invalidateOrders } from "@/lib/hooks";
import { formatINR, effectivePrice } from "@/lib/format";
import EmptyState from "@/components/EmptyState";

const STEPS = ["Address", "Review", "Payment"];

function CheckoutFlow() {
  const { user } = useAuth();
  const { cart, cartTotal, refreshCart, emptyCartLocally } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponFromCart = searchParams.get("coupon") || "";

  const { addresses, mutate: mutateAddresses } = useAddresses(!!user);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [step, setStep] = useState(0);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", line1: "", line2: "", city: "", state: "", pincode: "", isDefault: false });
  const [couponCode, setCouponCode] = useState(couponFromCart);
  const [discount, setDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(def.id);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (couponFromCart && cartTotal > 0) {
      api.validateCoupon(couponFromCart, cartTotal).then((r) => setDiscount(r.discount)).catch(() => setDiscount(0));
    }
  }, [couponFromCart, cartTotal]);

  if (!user) return <EmptyState icon="🔒" title="Sign in to checkout" ctaLabel="Sign in" ctaHref="/profile" />;
  if (cart.length === 0 && !placedOrder) return <EmptyState icon="🛒" title="Your cart is empty" ctaLabel="Shop now" ctaHref="/products" />;

  async function saveNewAddress() {
    setShowNewAddress(false);
    const tempId = `temp-${Date.now()}`;
    const optimistic = { ...newAddress, id: tempId };
    mutateAddresses([optimistic, ...addresses], false);
    setSelectedAddressId(tempId);
    try {
      const created = await api.addAddress(newAddress);
      mutateAddresses([created, ...addresses], false);
      setSelectedAddressId(created.id);
    } catch (err) {
      mutateAddresses(addresses, false); // roll back
      setError(err.message);
    }
  }

  async function placeOrder() {
    setError("");
    setPlacing(true);
    try {
      const order = await api.createOrder({ addressId: selectedAddressId, couponCode: couponCode || undefined });
      setPlacedOrder(order);
      emptyCartLocally(); // instant — don't wait on a cart refetch
      invalidateOrders(); // so /orders shows this order next time, without this page waiting
      refreshCart(); // background reconciliation, not awaited
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  if (placedOrder) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="font-display text-3xl text-brown">Order placed!</h1>
        <p className="text-brown/60 mt-2">Order ID: {placedOrder.id}</p>
        <div className="flex gap-3 justify-center mt-8">
          <button onClick={() => router.push("/products")} className="bg-beige text-brown px-6 py-3 rounded-xl2 font-semibold">
            Continue shopping
          </button>
          <button onClick={() => router.push(`/orders/${placedOrder.id}`)} className="bg-brown text-cream px-6 py-3 rounded-xl2 font-semibold hover:bg-gold transition-colors">
            Track order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${i <= step ? "bg-brown text-cream" : "bg-beige text-brown/50"}`}>
              {i + 1}
            </div>
            <span className={`text-sm ${i <= step ? "text-brown font-medium" : "text-brown/40"}`}>{s}</span>
            {i < STEPS.length - 1 && <span className="w-8 h-px bg-brown/20 mx-2" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl text-brown">Choose delivery address</h2>
          {addresses.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedAddressId(a.id)}
              className={`w-full text-left p-5 rounded-xl2 border-2 transition-colors ${selectedAddressId === a.id ? "border-gold bg-beige" : "border-brown/10 bg-white"}`}
            >
              <div className="flex justify-between">
                <span className="font-semibold text-brown">{a.label || "Address"}</span>
                {a.isDefault && <span className="text-xs bg-gold/20 text-gold font-medium px-2 py-1 rounded-full">Default</span>}
              </div>
              <p className="text-sm text-brown/60 mt-1">{a.line1}, {a.line2 && `${a.line2}, `}{a.city}, {a.state} {a.pincode}</p>
            </button>
          ))}

          {showNewAddress ? (
            <div className="p-5 rounded-xl2 border-2 border-brown/10 bg-white space-y-3">
              <input placeholder="Label (Home/Office)" className="w-full px-3 py-2 rounded-lg border border-brown/10 text-sm" onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
              <input placeholder="Address line 1" className="w-full px-3 py-2 rounded-lg border border-brown/10 text-sm" onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
              <input placeholder="Address line 2 (optional)" className="w-full px-3 py-2 rounded-lg border border-brown/10 text-sm" onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })} />
              <div className="grid grid-cols-3 gap-3">
                <input placeholder="City" className="px-3 py-2 rounded-lg border border-brown/10 text-sm" onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                <input placeholder="State" className="px-3 py-2 rounded-lg border border-brown/10 text-sm" onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                <input placeholder="Pincode" className="px-3 py-2 rounded-lg border border-brown/10 text-sm" onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-sm text-brown/70">
                <input type="checkbox" onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })} />
                Set as default
              </label>
              <button onClick={saveNewAddress} className="bg-brown text-cream px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gold transition-colors">
                Save address
              </button>
            </div>
          ) : (
            <button onClick={() => setShowNewAddress(true)} className="text-gold font-medium text-sm">
              + Add new address
            </button>
          )}

          <button
            disabled={!selectedAddressId}
            onClick={() => setStep(1)}
            className="w-full mt-6 bg-brown text-cream py-4 rounded-xl2 font-semibold disabled:opacity-40 hover:bg-gold transition-colors"
          >
            Continue to review
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl text-brown">Review your order</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm bg-white p-4 rounded-xl2 shadow-softer">
              <span>{item.product.name} × {item.qty}</span>
              <span className="font-medium">{formatINR(effectivePrice(item.product) * item.qty)}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 px-3 py-2 rounded-lg border border-brown/10 text-sm bg-white"
            />
            <button
              onClick={() => api.validateCoupon(couponCode.toUpperCase(), cartTotal).then((r) => setDiscount(r.discount)).catch((e) => setError(e.message))}
              className="px-4 py-2 bg-beige text-brown rounded-lg text-sm font-semibold"
            >
              Apply
            </button>
          </div>
          <div className="bg-beige rounded-xl2 p-5 text-sm space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(cartTotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>−{formatINR(discount)}</span></div>}
            <div className="flex justify-between font-semibold text-brown pt-2 border-t border-brown/10"><span>Total</span><span>{formatINR(cartTotal - discount)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 border-2 border-brown text-brown py-3 rounded-xl2 font-semibold">Back</button>
            <button onClick={() => setStep(2)} className="flex-1 bg-brown text-cream py-3 rounded-xl2 font-semibold hover:bg-gold transition-colors">Continue to payment</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 text-center">
          <h2 className="font-display text-xl text-brown">Payment</h2>
          <p className="text-brown/60 text-sm">
            Wire up your payment gateway (e.g. Razorpay) here. For now, placing the order records it as unpaid — hook the gateway's success callback up to this button.
          </p>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            onClick={placeOrder}
            disabled={placing}
            className="w-full bg-brown text-cream py-4 rounded-xl2 font-semibold hover:bg-gold transition-colors disabled:opacity-50"
          >
            {placing ? "Placing order…" : `Place order — ${formatINR(cartTotal - discount)}`}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-6 py-10 text-brown/50">Loading…</div>}>
      <CheckoutFlow />
    </Suspense>
  );
}
