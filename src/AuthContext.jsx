// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile, loginApi } from "./api";

const AuthContext = createContext(null);

function decodeTokenPayload(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const json = atob(payloadBase64);
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to decode JWT", e);
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeTokenPayload(token);
  if (!payload || !payload.exp) return true; // treat as expired if broken

  // exp is in seconds → convert to ms
  const expiresAtMs = payload.exp * 1000;
  return Date.now() > expiresAtMs;
}

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

      // ✅ Use JWT's own exp claim
      if (isTokenExpired(token)) {
        console.log("Token expired based on JWT exp");
        logoutInternal();
        setLoading(false);
        return;
      }

      try {
        const profile = await getMyProfile();
        setUser(profile);
      } catch (e) {
        console.error("Failed to load profile", e);

        // ✅ Safer status extraction for Axios and others
        const status = e?.response?.status ?? e.status;
        if (status === 401 || status === 403) {
          logoutInternal();
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function logoutInternal() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  async function login(username, password) {
    const { token: t } = await loginApi({ username, password });

    localStorage.setItem("token", t);
    setToken(t);

    // Optionally preload profile immediately
    try {
      const profile = await getMyProfile();
      setUser(profile);
    } catch (e) {
      console.error("Failed to load profile right after login", e);
    }
  }

  function logout() {
    logoutInternal();
  }

  const value = {
    token,
    user,
    isAuthenticated: !!token && !isTokenExpired(token),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
