"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/format";
import AdminGuard from "@/components/AdminGuard";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

function AdminOrdersList() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState(searchParams.get("customer") || "");
  const [statusFilter, setStatusFilter] = useState("ALL");

  async function load() {
    setOrders(await api.adminOrders());
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    const previous = orders;
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))); // instant
    try {
      await api.updateOrderStatus(id, status);
    } catch {
      setOrders(previous); // roll back
    }
  }

  const filtered = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o.user.name.toLowerCase().includes(search.toLowerCase()) ||
      o.user.email.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-brown">Manage orders</h1>
        <span className="text-sm text-brown/50">{filtered.length} of {orders.length} orders</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, email, or order ID"
          className="flex-1 px-3 py-2 rounded-lg border border-brown/10 text-sm bg-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-brown/10 text-sm bg-white"
        >
          <option value="ALL">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-sm text-brown/50 text-center py-10">No orders match that search.</p>
        )}
        {filtered.map((o) => (
          <div key={o.id} className="bg-white rounded-xl2 shadow-softer p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-brown">Order #{o.id.slice(0, 8)}</p>
                <p className="text-sm text-brown/60">{o.user.name} · {o.user.email}</p>
                <p className="text-sm text-brown/60 mt-1">
                  {o.address.line1}, {o.address.city}, {o.address.state} {o.address.pincode}
                </p>
                <p className="text-sm text-brown/50 mt-1">{o._count.items} item(s)</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-brown">{formatINR(o.total)}</p>
                <p className="text-xs text-brown/50 mt-1">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(o.id, s)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    o.status === s ? "bg-brown text-cream" : "bg-beige text-brown/60 hover:bg-gold/30"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminOrders() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-6 py-10 text-brown/50">Loading…</div>}>
      <AdminOrdersList />
    </Suspense>
  );
}

export default function Page() {
  return <AdminGuard><AdminOrders /></AdminGuard>;
}
