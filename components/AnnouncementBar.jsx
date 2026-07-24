"use client";
import { useEffect, useState } from "react";

const MESSAGES = [
  "🚚 Free shipping above ₹999",
  "✨ New Kalamkari collection released",
  "🎁 Flat ₹300 off today",
  "⭐ 5000+ happy customers",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-brown text-cream text-center text-xs sm:text-sm py-2 px-4 tracking-wide">
      <span key={index} className="animate-[fadeIn_0.4s_ease]">{MESSAGES[index]}</span>
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}
