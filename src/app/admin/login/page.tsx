"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Eye, EyeOff, Loader2, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const profile = await signInWithGoogle();
      if (profile) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(err?.message || "গুগল সাইন-ইন সম্পন্ন করা যায়নি।");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[#06080d] -z-20" />
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-indigo-600/15 blur-[180px] -z-10" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[140px] -z-10" />

      <div className="w-full max-w-[420px] animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3 shadow-xl shadow-indigo-500/25">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">LinkHub Creator & Admin</h1>
          <p className="text-xs text-slate-400 mt-1">প্রবেশ করুন এবং আপনার লিঙ্ক হাব পরিচালনা করুন</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-5 border border-white/10 shadow-2xl">
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Action: Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full py-3.5 px-4 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform ml-auto" />
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-white/[0.08] w-full" />
            <span className="bg-[#0e1322] px-3 text-[11px] text-slate-500 uppercase tracking-widest absolute">
              অথবা ইমেইল দিয়ে
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@linkhub.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Email Sign In</span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
