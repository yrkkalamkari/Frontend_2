"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminGuard from "@/components/AdminGuard";

const EMPTY_FORM = { code: "", discountType: "PERCENT", value: "", minOrderValue: "", expiryDate: "", usageLimit: "" };

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  async function load() {
    setCoupons(await api.adminCoupons());
  }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.createCoupon({
        ...form,
        value: parseFloat(form.value),
        minOrderValue: form.minOrderValue ? parseFloat(form.minOrderValue) : undefined,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
        expiryDate: form.expiryDate || undefined,
      });
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleActive(c) {
    setCoupons((prev) => prev.map((x) => (x.id === c.id ? { ...x, isActive: !x.isActive } : x))); // instant
    try {
      await api.updateCoupon(c.id, { isActive: !c.isActive });
    } catch (err) {
      setCoupons((prev) => prev.map((x) => (x.id === c.id ? { ...x, isActive: c.isActive } : x))); // roll back
      setError(err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-brown mb-8">Manage coupons</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl2 shadow-softer p-6 mb-10 grid sm:grid-cols-2 gap-4">
        <input required placeholder="Code (e.g. DIWALI20)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="px-3 py-2 rounded-lg border border-brown/10 text-sm" />
        <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="px-3 py-2 rounded-lg border border-brown/10 text-sm">
          <option value="PERCENT">Percent off</option>
          <option value="FLAT">Flat amount off</option>
        </select>
        <input required type="number" step="0.01" placeholder={form.discountType === "PERCENT" ? "Percent (e.g. 20)" : "Amount (₹)"} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="px-3 py-2 rounded-lg border border-brown/10 text-sm" />
        <input type="number" step="0.01" placeholder="Minimum order value (optional)" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} className="px-3 py-2 rounded-lg border border-brown/10 text-sm" />
        <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="px-3 py-2 rounded-lg border border-brown/10 text-sm" />
        <input type="number" placeholder="Usage limit (optional)" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="px-3 py-2 rounded-lg border border-brown/10 text-sm" />
        {error && <p className="sm:col-span-2 text-red-600 text-sm">{error}</p>}
        <button type="submit" className="sm:col-span-2 bg-brown text-cream px-6 py-3 rounded-xl2 font-semibold hover:bg-gold transition-colors">
          Create coupon
        </button>
      </form>

      <div className="space-y-3">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white rounded-xl2 shadow-softer p-4 flex justify-between items-center">
            <div>
              <span className="font-semibold text-brown">{c.code}</span>
              <p className="text-sm text-brown/60">
                {c.discountType === "PERCENT" ? `${c.value}% off` : `₹${c.value} off`}
                {c.minOrderValue && ` · min ₹${c.minOrderValue}`}
                {c.expiryDate && ` · expires ${new Date(c.expiryDate).toLocaleDateString("en-IN")}`}
                {` · used ${c.timesUsed}${c.usageLimit ? `/${c.usageLimit}` : ""}`}
              </p>
            </div>
            <button onClick={() => toggleActive(c)} className={`text-xs px-3 py-1 rounded-full font-medium ${c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              {c.isActive ? "Active" : "Inactive"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return <AdminGuard><AdminCoupons /></AdminGuard>;
}
