"use client";
import { useState } from "react";
import Link from "next/link";
import { Package, Heart, MapPin, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useAddresses } from "@/lib/hooks";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const { addresses, mutate: mutateAddresses } = useAddresses(!!user);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");
  const [savingPhone, setSavingPhone] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-brown mb-2">Welcome back</h1>
        <p className="text-brown/60 mb-8">Sign in with Google to see your orders, wishlist, and saved addresses.</p>
        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>
      </div>
    );
  }

  // Updates the visible name instantly; the network call happens in the background.
  function savePhone() {
    setUser({ ...user, phone });
    setEditingPhone(false);
    setSavingPhone(true);
    api.updateMe({ phone }).catch(() => setUser({ ...user, phone: user.phone })).finally(() => setSavingPhone(false));
  }

  // Optimistic delete: removes the card immediately, rolls back only if the
  // request actually fails.
  function deleteAddress(id) {
    const previous = addresses;
    mutateAddresses(previous.filter((a) => a.id !== id), false);
    api.deleteAddress(id).catch(() => mutateAddresses(previous, false));
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-10">
        {user.avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
        )}
        <div>
          <h1 className="font-display text-2xl text-brown">{user.name}</h1>
          <p className="text-brown/60 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <Link href="/orders" className="bg-beige rounded-xl2 p-6 flex flex-col items-center gap-2 hover:shadow-soft transition-shadow">
          <Package className="text-brown" size={22} />
          <span className="text-sm font-medium text-brown">Orders</span>
        </Link>
        <Link href="/wishlist" className="bg-beige rounded-xl2 p-6 flex flex-col items-center gap-2 hover:shadow-soft transition-shadow">
          <Heart className="text-brown" size={22} />
          <span className="text-sm font-medium text-brown">Wishlist</span>
        </Link>
        {user.role === "ADMIN" && (
          <Link href="/admin" className="bg-gold/20 rounded-xl2 p-6 flex flex-col items-center gap-2 hover:shadow-soft transition-shadow">
            <MapPin className="text-brown" size={22} />
            <span className="text-sm font-medium text-brown">Admin panel</span>
          </Link>
        )}
      </div>

      <div className="mb-10">
        <h2 className="font-display text-lg text-brown mb-3">Phone number</h2>
        {editingPhone ? (
          <div className="flex gap-2">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="px-3 py-2 rounded-lg border border-brown/10 text-sm" autoFocus />
            <button onClick={savePhone} className="bg-brown text-cream px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
          </div>
        ) : (
          <button onClick={() => setEditingPhone(true)} className="text-sm text-brown/70">
            {user.phone || "Add a phone number"} <span className="text-gold ml-2">Edit</span>
          </button>
        )}
      </div>

      <div className="mb-10">
        <h2 className="font-display text-lg text-brown mb-3">Saved addresses</h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-brown/50">No saved addresses yet — add one at checkout.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((a) => (
              <div key={a.id} className="flex justify-between items-start bg-white rounded-xl2 shadow-softer p-4">
                <div>
                  <span className="font-medium text-brown text-sm">{a.label || "Address"}{a.isDefault && " (Default)"}</span>
                  <p className="text-sm text-brown/60 mt-1">{a.line1}, {a.city}, {a.state} {a.pincode}</p>
                </div>
                <button onClick={() => deleteAddress(a.id)} className="text-sm text-red-500">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={logout} className="flex items-center gap-2 text-brown/60 text-sm hover:text-red-500 transition-colors">
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}
