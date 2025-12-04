// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile, loginApi } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Load token + expiry from localStorage on first render
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [tokenExpiresAt, setTokenExpiresAt] = useState(() => {
    const raw = localStorage.getItem("tokenExpiresAt");
    return raw ? Number(raw) : null;
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    async function loadProfile() {
      // No token at all → not logged in
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // We have a token but no expiry info → force logout (for safety)
      if (!tokenExpiresAt) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiresAt");
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      // Token expired according to frontend clock → logout
      if (Date.now() > tokenExpiresAt) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiresAt");
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      // Token exists and is not expired → try to load profile
      try {
        const profile = await getMyProfile();
        setUser(profile);
      } catch (e) {
        console.error("Failed to load profile", e);
        // Backend rejected token → clear it
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiresAt");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token, tokenExpiresAt]);

  // Called from LoginPage
  async function login(username, password) {
    const { token: t, expiresAt } = await loginApi({ username, password });

    // Save token + expiry in localStorage (expiry comes from backend; 7 days)
    localStorage.setItem("token", t);
    localStorage.setItem("tokenExpiresAt", String(expiresAt));

    setToken(t);
    setTokenExpiresAt(expiresAt);

    // Profile will be loaded by useEffect
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiresAt");
    setToken(null);
    setTokenExpiresAt(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    isAuthenticated: !!token && !!tokenExpiresAt && Date.now() < tokenExpiresAt,
    loading,
    login,
    logout,
  };

  // Do NOT block children – you already chose the right approach
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
