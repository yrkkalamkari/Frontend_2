export default function Divider({ className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-10 bg-gold/50" />
      <span className="text-gold text-sm">❖</span>
      <span className="h-px w-10 bg-gold/50" />
    </div>
  );
}
