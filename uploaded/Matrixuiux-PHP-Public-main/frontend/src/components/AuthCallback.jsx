import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

// Handles the Emergent Google Auth redirect: exchanges #session_id for a session cookie.
// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
const AuthCallback = () => {
  const hasProcessed = useRef(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    const sessionId = new URLSearchParams(window.location.hash.substring(1)).get("session_id");
    (async () => {
      try {
        const { data } = await api.post("/api/auth/google/session", { session_id: sessionId });
        setUser(data);
        navigate("/account", { replace: true, state: { user: data } });
      } catch (e) {
        console.warn("Google session exchange failed:", e);
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white" data-testid="auth-callback-loading">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-extrabold text-xl animate-pulse">U</div>
      <p className="mt-4 text-sm text-slate-500">Signing you in…</p>
    </div>
  );
};

export default AuthCallback;
