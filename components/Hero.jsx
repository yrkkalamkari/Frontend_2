"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Divider from "./Divider";

const heroImages = ["/Hero/1.png", "/Hero/2.png", "/Hero/3.png"];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-beige">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-brown leading-tight">
            Timeless Art.<br />Woven with Tradition.
          </h1>
          <Divider className="my-6 md:justify-start" />
          <p className="text-brown/70 leading-relaxed">
            Authentic Kalamkari textiles.<br />
            Handcrafted with love. Rooted in heritage.<br />
            Made for a timeless you.
          </p>
          <Link
            href="/products"
            className="inline-block mt-8 bg-brown text-cream px-8 py-4 rounded-lg font-bold tracking-wide text-sm uppercase shadow-soft hover:bg-brownDark hover:scale-105 transition-all duration-300"
          >
            Shop collection
          </Link>
        </div>

        <div className="rounded-xl2 overflow-hidden shadow-soft aspect-[4/5] bg-gradient-to-br from-gold/30 to-brown/30">
          <img src={heroImages[currentIndex]} alt="Featured hero slide" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
 