"use client";
import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brown text-cream/80 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-[1fr_1fr_auto_1.2fr] gap-10 text-sm">
        <div>
          <h4 className="text-cream font-semibold mb-3">Shop</h4>
          <ul className="space-y-2">
            <li><Link href="/products?category=sarees">Sarees</Link></li>
            <li><Link href="/products?category=dupattas">Dupattas</Link></li>
            <li><Link href="/products">All products</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-cream font-semibold mb-3">Customer service</h4>
          <ul className="space-y-2">
            <li><Link href="/orders">Track order</Link></li>
            <li><Link href="/about#sustainability">Policies</Link></li>
            <li>yrkkalamkari@gmail.com</li>
          </ul>
          <h4 className="text-cream font-semibold mb-3 mt-6">About us</h4>
          <ul className="space-y-2">
            <li><Link href="/about#our-story">Our story</Link></li>
            <li><Link href="/about#artisans">Artisans</Link></li>
            <li><Link href="/about#sustainability">Sustainability</Link></li>
          </ul>
        </div>

        <div className="flex md:flex-col items-start gap-4">
          <a href="https://www.instagram.com/yrk_collections?igsh=N2FjMnBvaW1lMzls" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-cream/30 flex items-center justify-center hover:bg-gold hover:border-gold transition-colors"><Instagram size={16} /></a>
          <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-cream/30 flex items-center justify-center hover:bg-gold hover:border-gold transition-colors"><Facebook size={16} /></a>
          <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full border border-cream/30 flex items-center justify-center hover:bg-gold hover:border-gold transition-colors"><Twitter size={16} /></a>
        </div>

        <div>
          <h4 className="text-cream font-display text-lg mb-2">Stay inspired</h4>
          <p className="text-cream/60 text-sm mb-4">Subscribe for updates on new collections and offers</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-4 py-2.5 rounded-lg text-brown text-sm focus:outline-none"
            />
            <button className="bg-gold text-brown px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-cream transition-colors">
              Sign up
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-cream/10 text-center text-xs py-4 text-cream/50">
        © {new Date().getFullYear()} YRK Collections. Handcrafted with care.
      </div>
    </footer>
  );
}
