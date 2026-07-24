"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [flying, setFlying] = useState(false); // triggers the "fly to cart" micro-animation

  const refreshCart = useCallback(async () => {
    if (!user) return setCart([]);
    try {
      setCart(await api.cart());
    } catch {}
  }, [user]);

  const refreshWishlist = useCallback(async () => {
    if (!user) return setWishlist([]);
    try {
      setWishlist(await api.wishlist());
    } catch {}
  }, [user]);

  useEffect(() => {
    if (user) {
      setCart(user.cart || []);
      setWishlist(user.wishlist || []);
    } else {
      setCart([]);
      setWishlist([]);
    }
  }, [user]);

  // Takes the full product object (not just an id) so the UI can update
  // instantly without waiting on the network round trip.
  async function addToCart(product, qty = 1) {
    if (!user) return { requireLogin: true };

    // Fire the "fly to cart" animation immediately — don't wait on the API.
    setFlying(true);
    setTimeout(() => setFlying(false), 600);

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { id: `optimistic-${product.id}`, productId: product.id, qty, product }];
    });

    try {
      await api.addToCart(product.id, qty);
      await refreshCart(); // reconcile with the server-assigned id/stock truth
    } catch (err) {
      await refreshCart(); // roll back to server state on failure
      throw err;
    }
  }

  async function updateQty(productId, qty) {
    setCart((prev) => prev.map((item) => (item.productId === productId ? { ...item, qty } : item)));
    try {
      await api.updateCartItem(productId, qty);
    } catch (err) {
      await refreshCart();
      throw err;
    }
  }

  async function removeFromCart(productId) {
    const previous = cart;
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    try {
      await api.removeCartItem(productId);
    } catch (err) {
      setCart(previous); // roll back
      throw err;
    }
  }

  async function toggleWishlist(product) {
    if (!user) return { requireLogin: true };
    const productId = typeof product === "string" ? product : product.id;
    const isIn = wishlist.some((w) => w.productId === productId || w.product?.id === productId);

    if (isIn) {
      setWishlist((prev) => prev.filter((w) => (w.product?.id || w.productId) !== productId));
    } else {
      setWishlist((prev) => [...prev, { id: `optimistic-${productId}`, productId, product: typeof product === "object" ? product : { id: productId } }]);
    }

    try {
      if (isIn) await api.removeFromWishlist(productId);
      else await api.addToWishlist(productId);
    } catch (err) {
      await refreshWishlist(); // roll back to server truth
      throw err;
    }
  }

  // Called right after a successful checkout — clears the cart in the UI
  // instantly instead of waiting on a refetch.
  function emptyCartLocally() {
    setCart([]);
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.product.discountPrice ?? item.product.price);
    return sum + price * item.qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart, wishlist, cartCount, cartTotal, flying,
        addToCart, updateQty, removeFromCart, toggleWishlist,
        refreshCart, refreshWishlist, emptyCartLocally,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
