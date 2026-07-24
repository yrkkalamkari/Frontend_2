const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kalamkari_token");
}

async function request(path, { method = "GET", body, auth = false, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  // Auth
  googleLogin: (idToken) => request("/auth/google", { method: "POST", body: { idToken } }),
  me: () => request("/auth/me", { auth: true }),

  // Profile
  updateMe: (body) => request("/users/me", { method: "PUT", body, auth: true }),
  addresses: () => request("/users/me/addresses", { auth: true }),
  addAddress: (body) => request("/users/me/addresses", { method: "POST", body, auth: true }),
  updateAddress: (id, body) => request(`/users/me/addresses/${id}`, { method: "PUT", body, auth: true }),
  deleteAddress: (id) => request(`/users/me/addresses/${id}`, { method: "DELETE", auth: true }),

  // Products
  products: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== "")).toString();
    return request(`/products${qs ? `?${qs}` : ""}`);
  },
  product: (slug) => request(`/products/${slug}`),
  categories: () => request("/categories"),

  // Cart
  cart: () => request("/cart", { auth: true }),
  addToCart: (productId, qty = 1) => request("/cart", { method: "POST", body: { productId, qty }, auth: true }),
  updateCartItem: (productId, qty) => request(`/cart/${productId}`, { method: "PUT", body: { qty }, auth: true }),
  removeCartItem: (productId) => request(`/cart/${productId}`, { method: "DELETE", auth: true }),
  clearCart: () => request("/cart", { method: "DELETE", auth: true }),

  // Wishlist
  wishlist: () => request("/wishlist", { auth: true }),
  addToWishlist: (productId) => request("/wishlist", { method: "POST", body: { productId }, auth: true }),
  removeFromWishlist: (productId) => request(`/wishlist/${productId}`, { method: "DELETE", auth: true }),

  // Coupons
  validateCoupon: (code, cartTotal) =>
    request("/coupons/validate", { method: "POST", body: { code, cartTotal }, auth: true }),

  // Orders
  createOrder: (body) => request("/orders", { method: "POST", body, auth: true }),
  orders: () => request("/orders", { auth: true }),
  order: (id) => request(`/orders/${id}`, { auth: true }),

  // Admin
  adminProducts: () => request("/admin/products", { auth: true }),
  createProduct: (body) => request("/admin/products", { method: "POST", body, auth: true }),
  updateProduct: (id, body) => request(`/admin/products/${id}`, { method: "PUT", body, auth: true }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: "DELETE", auth: true }),
  uploadProductImage: (id, formData) =>
    request(`/admin/products/${id}/images`, { method: "POST", body: formData, auth: true, isForm: true }),
  deleteProductImage: (productId, imageId) =>
    request(`/admin/products/${productId}/images/${imageId}`, { method: "DELETE", auth: true }),
  createCategory: (body) => request("/admin/categories", { method: "POST", body, auth: true }),
  adminCoupons: () => request("/admin/coupons", { auth: true }),
  createCoupon: (body) => request("/admin/coupons", { method: "POST", body, auth: true }),
  updateCoupon: (id, body) => request(`/admin/coupons/${id}`, { method: "PUT", body, auth: true }),
  adminOrders: () => request("/admin/orders", { auth: true }),
  updateOrderStatus: (id, status) =>
    request(`/admin/orders/${id}/status`, { method: "PUT", body: { status }, auth: true }),
};

export { getToken, API_URL };
