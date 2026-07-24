import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Divider from "./Divider";

const FEATURES = [
  { image: "/icons/HandPrinted.png", title: "Hand Printed", desc: "Every piece is hand printed by skilled artisans using traditional techniques." },
  { image: "/icons/NaturalColors.png", title: "Natural Colors", desc: "We use natural dyes extracted from plants, roots and minerals." },
  { image: "/icons/Cotton.png", title: "100% Cotton", desc: "Made with pure cotton that is soft, breathable and gentle on skin." },
  { image: "/icons/Artiseian.png", title: "Made by Artisans", desc: "Our artisans keep the centuries-old Kalamkari heritage alive." },
];

export default function FeaturesAndPromo() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="font-display text-2xl sm:text-3xl text-brown text-center mb-8">Why Kalamkari?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-beige border border-gold/25 rounded-[28px] shadow-softer px-4 sm:px-5 pt-8 pb-6 text-center flex flex-col items-center gap-3"
          >
            <div className="flex justify-center">
              <img src={f.image} alt={f.title} className="w-20 h-20 sm:w-24 sm:h-24 object-contain opacity-90" />
            </div>
            <h3 className="font-display text-lg sm:text-xl text-brown leading-tight">{f.title}</h3>
            <Divider className="scale-75" />
            <p className="text-xs sm:text-sm text-brown/60 leading-relaxed max-w-[220px]">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-beige border border-gold/25 rounded-xl2 shadow-softer px-6 py-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="text-brown text-sm sm:text-base">
          Celebrate tradition with timeless art —{" "}
          <span className="font-display text-2xl text-brown block sm:inline">10% OFF</span>{" "}
          on your first order
        </p>
        <Link
          href="/products"
          className="shrink-0 inline-flex items-center gap-1.5 bg-brown text-cream px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-brownDark transition-colors"
        >
          Shop now <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
