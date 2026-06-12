import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatApiErrorDetail } from "../lib/api";

const GoogleButton = () => {
  const handleGoogle = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/account";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };
  return (
    <button type="button" onClick={handleGoogle} data-testid="google-login-btn"
      className="w-full flex items-center justify-center gap-2.5 border border-slate-300 rounded-lg py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
      <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.16-3.16A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/></svg>
      Continue with Google
    </button>
  );
};

export default function Auth({ mode = "login" }) {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const isLogin = mode === "login";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/account" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate("/account");
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-slate-50 py-14 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900">{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p className="text-sm text-slate-500 mt-1">{isLogin ? "Sign in to view your orders and license keys." : "Track orders and access your license keys anytime."}</p>

          <div className="mt-6"><GoogleButton /></div>
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" /><span className="text-xs text-slate-400">or with email</span><div className="flex-1 h-px bg-slate-200" />
          </div>

          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" data-testid="auth-error">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label>Full Name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input required value={form.name} onChange={set("name")} placeholder="John Doe" className="pl-9" data-testid="register-name-input" />
                </div>
              </div>
            )}
            <div>
              <Label>Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input required type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" className="pl-9" data-testid="auth-email-input" />
              </div>
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input required type="password" minLength={6} value={form.password} onChange={set("password")} placeholder="••••••••" className="pl-9" data-testid="auth-password-input" />
              </div>
            </div>
            <Button type="submit" disabled={busy} className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-semibold" data-testid="auth-submit-btn">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
            </Button>
          </form>

          <p className="mt-5 text-sm text-slate-500 text-center">
            {isLogin ? (
              <>New here? <Link to="/register" className="text-blue-700 font-semibold hover:underline" data-testid="goto-register">Create an account</Link></>
            ) : (
              <>Already have an account? <Link to="/login" className="text-blue-700 font-semibold hover:underline" data-testid="goto-login">Sign in</Link></>
            )}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
