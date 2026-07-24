"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/lib/hooks";
import { formatINR } from "@/lib/format";
import EmptyState from "@/components/EmptyState";

const STATUS_LABEL = {
  PENDING: "Ordered",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders, isLoading } = useOrders(!!user);

  if (!user) return <EmptyState icon="📦" title="Sign in to view your orders" ctaLabel="Sign in" ctaHref="/profile" />;
  if (isLoading && orders.length === 0) return <div className="max-w-4xl mx-auto px-6 py-16 text-brown/50">Loading…</div>;
  if (orders.length === 0) return <EmptyState icon="📦" title="No orders yet" ctaLabel="Start shopping" ctaHref="/products" />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-brown mb-8">Your orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <Link key={o.id} href={`/orders/${o.id}`} className="block bg-white rounded-xl2 shadow-softer p-5 hover:shadow-soft transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-brown/50">Order #{o.id.slice(0, 8)}</p>
                <p className="text-sm text-brown/60 mt-1">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-beige text-brown font-medium px-3 py-1 rounded-full">{STATUS_LABEL[o.status]}</span>
                <p className="font-semibold text-brown mt-2">{formatINR(o.total)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
