import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, clearAuth, getAuth } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token, expiresAt } = getAuth();
    if (token && expiresAt && Date.now() < expiresAt) {
      setIsAuthenticated(true);
      setExpiresAt(expiresAt);
    } else {
      clearAuth();
      setIsAuthenticated(false);
      setExpiresAt(null);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await authApi.login({ username, password });
    setIsAuthenticated(true);
    setExpiresAt(res.expiresAt);
  };

  const register = (username, email, password) => {
    return authApi.register({ username, email, password });
  };

  const logout = () => {
    clearAuth();
    setIsAuthenticated(false);
    setExpiresAt(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        expiresAt,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
