"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export default function GoogleLoginButton({ onSuccess }) {
  const ref = useRef(null);
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    function render() {
      if (!window.google || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const user = await loginWithGoogle(response.credential);
            onSuccess?.(user);
          } catch (err) {
            console.error("Google login failed:", err.message);
          }
        },
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "signin_with",
      });
    }

    if (window.google) {
      render();
      return;
    }

    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener("load", render);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = render;
    document.body.appendChild(script);
  }, [loginWithGoogle, onSuccess]);

  return <div ref={ref} />;
}
