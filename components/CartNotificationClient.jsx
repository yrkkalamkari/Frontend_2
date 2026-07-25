"use client";
import { useCart } from "@/context/CartContext";
import CartNotification from "./CartNotification";

export default function CartNotificationClient() {
  const { toastMessage, clearToast } = useCart();
  return <CartNotification message={toastMessage} onClose={clearToast} />;
}
