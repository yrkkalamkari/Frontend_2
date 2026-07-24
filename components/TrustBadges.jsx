const BADGES = [
  { icon: "🚚", label: "Free shipping" },
  { icon: "🔄", label: "Easy returns" },
  { icon: "⭐", label: "5000+ happy customers" },
];

export default function TrustBadges() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-3 gap-4 text-center">
      {BADGES.map((b) => (
        <div key={b.label} className="flex flex-col items-center gap-2">
          <span className="text-2xl">{b.icon}</span>
          <span className="text-xs sm:text-sm text-brown/70 font-medium">{b.label}</span>
        </div>
      ))}
    </section>
  );
}
