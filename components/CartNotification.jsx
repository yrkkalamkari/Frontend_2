"use client";

export default function CartNotification({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-3xl bg-brown text-cream px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="text-cream/80 hover:text-cream">
          ×
        </button>
      </div>
    </div>
  );
}
