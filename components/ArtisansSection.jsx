import Image from "next/image";

export default function ArtisansSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="font-display text-2xl sm:text-3xl text-brown mb-8 text-center">Our artisans</h2>
      <div className="relative rounded-xl2 overflow-hidden shadow-soft grid md:grid-cols-[1.3fr_1fr] bg-navy min-h-[320px]">
        <div className="relative bg-gradient-to-br from-brown/40 to-navy/60 flex items-center justify-center overflow-hidden">
          <Image
            src="/Artesian.png"
            alt="Artisan at work"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="bg-brown flex flex-col justify-center px-8 py-10 sm:px-10">
          <h3 className="font-display text-2xl sm:text-3xl text-cream mb-3">Meet the masters</h3>
          <p className="text-cream/70 leading-relaxed">
            Celebrating centuries-old craftsmanship from Andhra Pradesh — every piece is hand-drawn
            or block-printed by artisans who learned the craft from their families, generation
            after generation.
          </p>
        </div>
      </div>
    </section>
  );
}
