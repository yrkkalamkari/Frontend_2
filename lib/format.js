export function formatINR(value) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return "₹0";
  return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function effectivePrice(product) {
  const price = parseFloat(product.discountPrice ?? product.price);
  return price;
}

export function originalPrice(product) {
  return product.discountPrice ? parseFloat(product.price) : null;
}

export function discountPercent(product) {
  if (!product.discountPrice) return null;
  const p = parseFloat(product.price);
  const d = parseFloat(product.discountPrice);
  return Math.round(((p - d) / p) * 100);
}

export function primaryImage(product) {
  if (!product.images || product.images.length === 0) return "/icons/icon-512.png";
  const primary = product.images.find((i) => i.isPrimary);
  return (primary || product.images[0]).url;
}

// Rewrites a Cloudinary URL to request an auto-format, auto-quality,
// width-capped version instead of the original upload — this is the single
// biggest lever for fast product browsing, since it can cut image payloads
// by 70-90% with no visible quality loss. No-ops on non-Cloudinary URLs.
export function optimizedImage(url, width = 600) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
