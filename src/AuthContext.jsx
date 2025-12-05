// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile, loginApi } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [tokenExpiresAt, setTokenExpiresAt] = useState(() => {
    const raw = localStorage.getItem("tokenExpiresAt");
    return raw ? Number(raw) : null;
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      if (!tokenExpiresAt || Date.now() > tokenExpiresAt) {
        // expired or missing expiry → clear
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiresAt");
        setToken(null);
        setTokenExpiresAt(null);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await getMyProfile();
        setUser(profile);
      } catch (e) {
        console.error("Failed to load profile", e);

        // ❗ Only logout on unauthorized
        if (e.status === 401 || e.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiresAt");
          setToken(null);
          setTokenExpiresAt(null);
          setUser(null);
        } else {
          // For 500 / network issues, keep the token and just don't set user
          // Optionally show a toast in the UI.
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token, tokenExpiresAt]);

  async function login(username, password) {
    const { token: t, expiresAt } = await loginApi({ username, password });

    localStorage.setItem("token", t);
    localStorage.setItem("tokenExpiresAt", String(expiresAt));

    setToken(t);
    setTokenExpiresAt(expiresAt);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
