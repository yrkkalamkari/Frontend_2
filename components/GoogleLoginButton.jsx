"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

let googleScriptPromise = null;

function loadGoogleScript() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.google?.accounts?.id) return Promise.resolve(true);

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve) => {
      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

      const finish = () => resolve(Boolean(window.google?.accounts?.id));

      if (existing) {
        if (existing.dataset.loaded === "true") {
          finish();
          return;
        }
        existing.addEventListener("load", finish, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        script.dataset.loaded = "true";
        finish();
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return googleScriptPromise;
}

export default function GoogleLoginButton({ onSuccess }) {
  const ref = useRef(null);
  const initializedRef = useRef(false);
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (cancelled || initializedRef.current || !ref.current) return;

      const ready = await loadGoogleScript();
      if (!ready || cancelled || !ref.current || !window.google?.accounts?.id) return;

      initializedRef.current = true;
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

    void render();

    return () => {
      cancelled = true;
    };
  }, [loginWithGoogle, onSuccess]);

  return <div ref={ref} />;
}
