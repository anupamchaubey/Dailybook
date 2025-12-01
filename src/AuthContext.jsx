import React, { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile, loginApi } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await getMyProfile();
        setUser(profile);
      } catch (e) {
        console.error("Failed to load profile", e);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [token]);

  async function login(username, password) {
    const { token: t } = await loginApi({ username, password });
    localStorage.setItem("token", t);
    setToken(t);
    // profile will load via useEffect
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  // ❗ Do NOT block children here; always render them
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
