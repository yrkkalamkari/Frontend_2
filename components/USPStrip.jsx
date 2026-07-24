const ITEMS = [
  { icon: "❖", label: "Handmade with heritage" },
  { icon: "🌿", label: "Natural & sustainable" },
  { icon: "🤝", label: "Supporting artisans" },
  { icon: "❖", label: "Made to last" },
];

export default function USPStrip() {
  return (
    <div className="bg-brown ornamental-border">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-cream/80 text-xs font-semibold tracking-wide uppercase text-center">
        {ITEMS.map((item, i) => (
          <span key={item.label} className="flex items-center gap-3">
            {i > 0 && <span className="text-gold/50">|</span>}
            <span>{item.icon} {item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
