"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useOrder } from "@/lib/hooks";
import { formatINR, primaryImage } from "@/lib/format";

const TIMELINE = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
const TIMELINE_LABEL = { PENDING: "Ordered", CONFIRMED: "Confirmed", SHIPPED: "Shipped", DELIVERED: "Delivered" };

export default function OrderDetailPage() {
  const { id } = useParams();
  const { order, isLoading } = useOrder(id);

  if (isLoading && !order) return <div className="max-w-3xl mx-auto px-6 py-16 text-brown/50">Loading…</div>;
  if (!order) return <div className="max-w-3xl mx-auto px-6 py-16 text-brown/50">Order not found.</div>;

  const currentIndex = TIMELINE.indexOf(order.status);
  const cancelled = order.status === "CANCELLED";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-brown mb-1">Order #{order.id.slice(0, 8)}</h1>
      <p className="text-brown/60 text-sm mb-8">
        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      {cancelled ? (
        <div className="bg-red-50 text-red-600 rounded-xl2 p-4 text-sm font-medium mb-8">This order was cancelled.</div>
      ) : (
        <div className="flex items-center justify-between mb-10">
          {TIMELINE.map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <div className={`absolute top-3 right-1/2 w-full h-0.5 ${i <= currentIndex ? "bg-gold" : "bg-brown/10"}`} />
              )}
              <div className={`w-7 h-7 rounded-full z-10 flex items-center justify-center text-xs font-semibold ${i <= currentIndex ? "bg-gold text-white" : "bg-beige text-brown/40"}`}>
                {i + 1}
              </div>
              <span className={`text-xs mt-2 ${i <= currentIndex ? "text-brown font-medium" : "text-brown/40"}`}>{TIMELINE_LABEL[step]}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 mb-8">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white rounded-xl2 shadow-softer p-4">
            <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-beige shrink-0">
              <Image src={primaryImage(item.product)} alt={item.product.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-brown">{item.product.name}</p>
              <p className="text-xs text-brown/50 mt-1">Qty {item.qty}</p>
            </div>
            <span className="text-sm font-semibold text-brown">{formatINR(item.priceAtPurchase * item.qty)}</span>
          </div>
        ))}
      </div>

      <div className="bg-beige rounded-xl2 p-5 text-sm space-y-1 mb-8">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
        {parseFloat(order.discountAmount) > 0 && (
          <div className="flex justify-between text-green-700"><span>Discount</span><span>−{formatINR(order.discountAmount)}</span></div>
        )}
        <div className="flex justify-between font-semibold text-brown pt-2 border-t border-brown/10"><span>Total</span><span>{formatINR(order.total)}</span></div>
      </div>

      <div>
        <h2 className="font-display text-lg text-brown mb-2">Delivery address</h2>
        <p className="text-sm text-brown/60">
          {order.address.line1}, {order.address.line2 && `${order.address.line2}, `}{order.address.city}, {order.address.state} {order.address.pincode}
        </p>
      </div>
    </div>
  );
}
