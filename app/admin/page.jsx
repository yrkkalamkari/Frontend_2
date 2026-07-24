"use client";
import Link from "next/link";
import { Package, Tag, ClipboardList, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import EmptyState from "@/components/EmptyState";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-16 text-brown/50">Loading…</div>;
  if (!user) return <EmptyState icon="🔒" title="Sign in required" ctaLabel="Sign in" ctaHref="/profile" />;
  if (user.role !== "ADMIN") return <EmptyState icon="🚫" title="Admin access only" subtitle="This account doesn't have admin permissions." />;

  const cards = [
    { href: "/admin/products", icon: Package, label: "Products", desc: "Add, edit, and upload images" },
    { href: "/admin/coupons", icon: Tag, label: "Coupons", desc: "Create discount codes" },
    { href: "/admin/orders", icon: ClipboardList, label: "Orders", desc: "View and update order status" },
    { href: "/admin/customers", icon: Users, label: "Customers", desc: "See every customer's orders and spend" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-brown mb-8">Admin panel</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="bg-beige rounded-xl2 p-6 hover:shadow-soft transition-shadow">
            <c.icon className="text-brown mb-3" size={22} />
            <h2 className="font-semibold text-brown">{c.label}</h2>
            <p className="text-sm text-brown/60 mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
