"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("kalamkari_token") : null;
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const me = await api.me();
      setUser(me);
    } catch {
      localStorage.removeItem("kalamkari_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Called with the ID token Google's button hands back.
  // We update the UI immediately with the Google profile and fetch the full
  // profile in the background so the login feels responsive.
  const loginWithGoogle = useCallback(async (idToken) => {
    const { token, user: googleUser } = await api.googleLogin(idToken);
    localStorage.setItem("kalamkari_token", token);

    const immediateUser = {
      ...googleUser,
      addresses: [],
      cart: [],
      wishlist: [],
    };
    setUser(immediateUser);

    void api.me()
      .then((full) => {
        if (full) setUser(full);
      })
      .catch(() => {
        // Keep the immediately available Google profile if the full profile fetch fails.
      });

    return immediateUser;
  }, []);

  function logout() {
    localStorage.removeItem("kalamkari_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginWithGoogle, logout, refresh: hydrate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
