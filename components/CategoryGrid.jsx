"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCategories } from "@/lib/hooks";

const categoryImages = {
  saree: "/Categories/Sarees_2.png",
  sarees: "/Categories/Sarees_2.png",
  sari: "/Categories/Sarees.png",
  dupatta: "/Categories/Duppatas.png",
  dupattas: "/Categories/Duppatas.png",
  duppata: "/Categories/Duppatas.png",
  duppatas: "/Categories/Duppatas.png",
};

export default function CategoryGrid({ categories = [] }) {
  const [imageErrors, setImageErrors] = useState({});
  const { categories: fetchedCategories, isLoading } = useCategories();

  const safeCategories = Array.isArray(categories) && categories.length
    ? categories
    : Array.isArray(fetchedCategories)
    ? fetchedCategories
    : [];

  if (!safeCategories.length) {
    if (isLoading) return null;
    return null;
  }

  const handleImageError = (id) => {
    console.log("Image failed:", id);
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const getImage = (category) => {
    const slug = category.slug?.trim().toLowerCase();
    const name = category.name?.trim().toLowerCase();

    return (
      category.imageUrl ||
      categoryImages[slug] ||
      categoryImages[name] ||
      "/Categories/Sarees_2.png"
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="font-display text-2xl sm:text-3xl text-brown mb-8 text-center">
        Featured Categories
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 sm:px-2 lg:px-0">
        {safeCategories.map((c) => {
          const imageUrl = getImage(c);

          return (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="group relative min-w-[220px] flex-shrink-0 aspect-[3/4] rounded-xl2 overflow-hidden shadow-softer"
            >
              {!imageErrors[c.id] && (
                <Image
                  src={imageUrl}
                  alt={c.name}
                  fill
                  priority
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => handleImageError(c.id)}
                />
              )}

              {imageErrors[c.id] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  {c.name}
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <span className="absolute bottom-4 left-4 z-10 text-white font-bold uppercase">
                {c.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}