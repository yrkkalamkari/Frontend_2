"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/format";
import AdminGuard from "@/components/AdminGuard";

const EMPTY_FORM = { name: "", description: "", price: "", discountPrice: "", stock: "", fabricType: "", categoryId: "" };

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [uploadingFor, setUploadingFor] = useState(null);
  const [error, setError] = useState("");

  async function loadAll() {
    const [prods, cats] = await Promise.all([api.adminProducts(), api.categories()]);
    setProducts(prods);
    setCategories(cats);
  }

  useEffect(() => { loadAll(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
        stock: parseInt(form.stock) || 0,
      };
      if (editingId) {
        await api.updateProduct(editingId, payload);
      } else {
        await api.createProduct(payload);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name, description: p.description, price: p.price, discountPrice: p.discountPrice || "",
      stock: p.stock, fabricType: p.fabricType || "", categoryId: p.categoryId,
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    const previous = products;
    setProducts((prev) => prev.filter((p) => p.id !== id)); // instant
    try {
      await api.deleteProduct(id);
    } catch (err) {
      setProducts(previous); // roll back
      setError(err.message);
    }
  }

  async function toggleActive(p) {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, isActive: !x.isActive } : x))); // instant
    try {
      await api.updateProduct(p.id, { isActive: !p.isActive });
    } catch (err) {
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, isActive: p.isActive } : x))); // roll back
      setError(err.message);
    }
  }

  async function handleImageUpload(productId, file) {
    setUploadingFor(productId);
    const formData = new FormData();
    formData.append("image", file);
    try {
      await api.uploadProductImage(productId, formData);
      await loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingFor(null);
    }
  }

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    await api.createCategory({ name: newCategoryName });
    setNewCategoryName("");
    await loadAll();
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-brown mb-8">Manage products</h1>

      {/* Category quick-add */}
      <div className="flex gap-2 mb-8">
        <input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          className="px-3 py-2 rounded-lg border border-brown/10 text-sm"
        />
        <button onClick={handleAddCategory} className="bg-beige text-brown px-4 py-2 rounded-lg text-sm font-semibold">
          Add category
        </button>
      </div>

      {/* Product form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl2 shadow-softer p-6 mb-10 grid sm:grid-cols-2 gap-4">
        <h2 className="sm:col-span-2 font-semibold text-brown">{editingId ? "Edit product" : "Add new product"}</h2>
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-lg border border-brown/10 text-sm" />
        <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="px-3 py-2 rounded-lg border border-brown/10 text-sm">
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2 px-3 py-2 rounded-lg border border-brown/10 text-sm" rows={3} />
        <input required type="number" step="0.01" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-3 py-2 rounded-lg border border-brown/10 text-sm" />
        <input type="number" step="0.01" placeholder="Discount price (₹, optional)" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="px-3 py-2 rounded-lg border border-brown/10 text-sm" />
        <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="px-3 py-2 rounded-lg border border-brown/10 text-sm" />
        <input placeholder="Fabric type" value={form.fabricType} onChange={(e) => setForm({ ...form, fabricType: e.target.value })} className="px-3 py-2 rounded-lg border border-brown/10 text-sm" />
        {error && <p className="sm:col-span-2 text-red-600 text-sm">{error}</p>}
        <div className="sm:col-span-2 flex gap-3">
          <button type="submit" className="bg-brown text-cream px-6 py-3 rounded-xl2 font-semibold hover:bg-gold transition-colors">
            {editingId ? "Save changes" : "Create product"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }} className="px-6 py-3 text-brown/60">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product list */}
      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-xl2 shadow-softer p-4 flex gap-4 items-start">
            <div className="flex gap-2 shrink-0">
              {p.images.map((img) => (
                <div key={img.id} className="relative w-16 h-20 rounded-lg overflow-hidden bg-beige">
                  <Image src={img.url} alt="" fill className="object-cover" />
                </div>
              ))}
              <label className="w-16 h-20 rounded-lg border-2 border-dashed border-brown/20 flex items-center justify-center text-xs text-brown/50 cursor-pointer text-center">
                {uploadingFor === p.id ? "…" : "+ Image"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleImageUpload(p.id, e.target.files[0])} />
              </label>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium text-brown">{p.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full h-fit ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-brown/60">{formatINR(p.discountPrice || p.price)} · Stock: {p.stock} · {p.category?.name}</p>
              <div className="flex gap-3 mt-2 text-sm">
                <button onClick={() => startEdit(p)} className="text-gold font-medium">Edit</button>
                <button onClick={() => toggleActive(p)} className="text-brown/60">
                  {p.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-red-500">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return <AdminGuard><AdminProducts /></AdminGuard>;
}
