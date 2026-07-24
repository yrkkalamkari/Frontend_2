import Link from "next/link";
import Divider from "@/components/Divider";
import USPStrip from "@/components/USPStrip";

export const metadata = {
  title: "About — YRK Collections",
  description: "The story behind YRK Collections' handcrafted Kalamkari textiles — our artisans, our process, and our commitment to sustainable, natural dyeing.",
};

const FEATURES = [
  { icon: "🌿", label: "Natural Dyes" },
  { icon: "✋", label: "Handcrafted" },
  { icon: "❤️", label: "Heritage Art" },
  { icon: "♻️", label: "Sustainable" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="font-display text-4xl sm:text-5xl text-brown leading-tight">About Kalamkari</h1>
          <Divider className="my-6 md:justify-start" />
          <div className="space-y-4 text-brown/70 leading-relaxed">
            <p>
              Kalamkari is more than just a fabric — it's a story painted by hand, passed down
              through generations. From the delicate strokes of the artist's pen to the vibrant
              natural dyes, every piece is a labor of love.
            </p>
            <p>
              At YRK Collections, we bring you authentic handcrafted textiles that celebrate
              tradition, craftsmanship, and sustainability.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-10">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-2 text-center">
                <span className="w-14 h-14 rounded-full border border-brown/25 flex items-center justify-center text-xl">
                  {f.icon}
                </span>
                <span className="text-xs font-medium text-brown/70">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl2 overflow-hidden shadow-soft aspect-[4/5] bg-gradient-to-br from-gold/30 to-brown/30 flex items-center justify-center">
          {/* Replace with a real photo of block-print tools and dyes */}
          <span className="font-display text-brown/40">Craft materials</span>
        </div>
      </section>

      <section id="our-story" className="bg-beige scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-brown mb-4">Our story</h2>
          <Divider className="mb-6" />
          <p className="text-brown/70 leading-relaxed max-w-2xl mx-auto">
            YRK Collections started with a simple idea: bring genuine, hand-crafted Kalamkari
            textiles directly from artisan workshops to your wardrobe. Every saree, dupatta, and
            length of fabric we sell is sourced directly from printing clusters where this craft
            has been practiced for generations.
          </p>
        </div>
      </section>

      <section id="artisans" className="max-w-4xl mx-auto px-6 py-16 scroll-mt-24">
        <h2 className="font-display text-2xl sm:text-3xl text-brown mb-4 text-center">Our process</h2>
        <Divider className="mb-10" />
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { step: "1", title: "Fabric preparation", desc: "Cotton cloth is treated with myrobalan and buffalo milk, then sun-dried — this lets natural dyes bind to the fibre." },
            { step: "2", title: "Hand drawing / block printing", desc: "Pen-Kalamkari artisans draw motifs freehand with a bamboo pen dipped in fermented dye; block-print artisans stamp patterns by hand, one colour at a time." },
            { step: "3", title: "Natural dyeing", desc: "Colours come from roots, flowers, and minerals — indigo for blue, madder root for red, iron filings for black." },
            { step: "4", title: "Washing & finishing", desc: "Each piece is washed multiple times between dye stages, then finished and quality-checked by hand." },
          ].map((s) => (
            <div key={s.step} className="bg-white rounded-xl2 p-6 shadow-softer">
              <span className="text-gold font-display text-2xl">{s.step}</span>
              <h3 className="font-semibold text-brown mt-2">{s.title}</h3>
              <p className="text-sm text-brown/60 mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sustainability" className="bg-beige scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-brown mb-4">Sustainability</h2>
          <Divider className="mb-6" />
          <p className="text-brown/70 leading-relaxed max-w-2xl mx-auto">
            Kalamkari is, by nature, a low-impact craft: natural dyes instead of synthetic
            chemicals, hand processes instead of energy-intensive machinery, and cotton fabric
            that biodegrades instead of shedding microplastics. We work directly with artisan
            families rather than intermediaries, so fair payment reaches the people doing the work.
          </p>
          <Link
            href="/products"
            className="inline-block mt-8 bg-brown text-cream px-8 py-4 rounded-lg font-bold uppercase text-sm tracking-wide shadow-soft hover:bg-brownDark transition-colors"
          >
            Shop the collection
          </Link>
        </div>
      </section>

      <USPStrip />
    </div>
  );
}
