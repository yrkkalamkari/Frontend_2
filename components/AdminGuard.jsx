"use client";
import { useAuth } from "@/context/AuthContext";
import EmptyState from "@/components/EmptyState";

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-16 text-brown/50">Loading…</div>;
  if (!user) return <EmptyState icon="🔒" title="Sign in required" ctaLabel="Sign in" ctaHref="/profile" />;
  if (user.role !== "ADMIN") return <EmptyState icon="🚫" title="Admin access only" />;

  return children;
}
