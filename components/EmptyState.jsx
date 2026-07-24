import Link from "next/link";

export default function EmptyState({ icon, title, subtitle, ctaLabel, ctaHref }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <span className="text-5xl mb-4">{icon}</span>
      <h2 className="font-display text-xl text-brown">{title}</h2>
      {subtitle && <p className="text-brown/60 mt-2 text-sm">{subtitle}</p>}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="mt-6 bg-brown text-cream px-6 py-3 rounded-xl2 font-semibold hover:bg-gold transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
