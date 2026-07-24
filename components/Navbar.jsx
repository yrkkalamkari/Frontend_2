"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Shop", href: "/products" },
  { label: "Collections", href: "/products" },
  { label: "Our Process", href: "/about#artisans" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-cream ornamental-border shadow-softer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.jpg" alt="YRK Collections logo" className="w-10 h-10 object-contain rounded-full" />
          <div className="leading-tight">
            <span className="font-display text-xl text-brown tracking-wide block">YRK Collections</span>
            <span className="hidden sm:block text-[10px] text-brown/50 tracking-[0.15em] uppercase">
              Timeless art. Living tradition.
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide uppercase text-brown/70">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`hover:text-gold transition-colors pb-1 ${pathname === l.href ? "text-brown border-b-2 border-brown" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-brown">
          <button onClick={() => setSearchOpen((o) => !o)} aria-label="Search" className="hover:text-gold transition-colors">
            <Search size={19} />
          </button>
          <Link href="/profile" aria-label="Account" className="hover:text-gold transition-colors">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <User size={19} />
            )}
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative hover:text-gold transition-colors">
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="lg:hidden" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
          <div className="flex border border-brown/20 rounded-lg overflow-hidden">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search authentic art…"
              className="flex-1 px-4 py-2.5 text-sm bg-white focus:outline-none"
            />
            <button type="submit" className="bg-brown text-cream px-4 hover:bg-brownDark transition-colors" aria-label="Search">
              <Search size={18} />
            </button>
          </div>
        </form>
      )}

      {menuOpen && (
        <div className="lg:hidden bg-cream flex flex-col gap-3 px-6 pb-4 text-brown/80 text-sm font-semibold uppercase tracking-wide border-t border-brown/10 pt-4">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
