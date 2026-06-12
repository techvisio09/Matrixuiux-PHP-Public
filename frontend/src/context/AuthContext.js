import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../lib/api";

// user: null = checking, false = not authenticated, object = authenticated
const AuthContext = createContext({ user: null });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data);
    } catch {
      // No active session — user is simply not authenticated.
      setUser(false);
    }
  }, []);

  useEffect(() => {
    // CRITICAL: If returning from OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    if (window.location.hash?.includes("session_id=")) {
      setUser(false);
      return;
    }
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/api/auth/register", { name, email, password });
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (e) {
      // Session is cleared client-side regardless; log for diagnostics.
      console.warn("Logout request failed:", e);
    }
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
