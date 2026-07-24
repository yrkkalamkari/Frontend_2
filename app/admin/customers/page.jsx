"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/format";
import AdminGuard from "@/components/AdminGuard";

function AdminCustomers() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.adminOrders().then(setOrders);
  }, []);

  // Group orders by customer, client-side — no new backend endpoint needed,
  // the data (user + total + createdAt) is already in every order object.
  const customerMap = new Map();
  for (const o of orders) {
    const key = o.user.id;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        user: o.user,
        orderCount: 0,
        totalSpent: 0,
        lastOrderAt: o.createdAt,
      });
    }
    const entry = customerMap.get(key);
    entry.orderCount += 1;
    entry.totalSpent += parseFloat(o.total);
    if (new Date(o.createdAt) > new Date(entry.lastOrderAt)) entry.lastOrderAt = o.createdAt;
  }

  const customers = Array.from(customerMap.values())
    .filter(
      (c) =>
        !search ||
        c.user.name.toLowerCase().includes(search.toLowerCase()) ||
        c.user.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-brown">Customers</h1>
        <span className="text-sm text-brown/50">{customers.length} customer(s)</span>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
        className="w-full px-3 py-2 rounded-lg border border-brown/10 text-sm bg-white mb-6"
      />

      <div className="space-y-3">
        {customers.length === 0 && (
          <p className="text-sm text-brown/50 text-center py-10">No customers have placed an order yet.</p>
        )}
        {customers.map((c) => (
          <button
            key={c.user.id}
            onClick={() => router.push(`/admin/orders?customer=${encodeURIComponent(c.user.email)}`)}
            className="w-full text-left bg-white rounded-xl2 shadow-softer p-5 flex justify-between items-center hover:shadow-soft transition-shadow"
          >
            <div className="flex items-center gap-3">
              {c.user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.user.avatarUrl} alt={c.user.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-beige flex items-center justify-center text-brown/50 font-display text-sm">
                  {c.user.name.slice(0, 1)}
                </div>
              )}
              <div>
                <p className="font-medium text-brown text-sm">{c.user.name}</p>
                <p className="text-xs text-brown/50">{c.user.email}{c.user.phone ? ` · ${c.user.phone}` : ""}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-brown">{formatINR(c.totalSpent)}</p>
              <p className="text-xs text-brown/50 mt-1">
                {c.orderCount} order{c.orderCount > 1 ? "s" : ""} · last {new Date(c.lastOrderAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return <AdminGuard><AdminCustomers /></AdminGuard>;
}
