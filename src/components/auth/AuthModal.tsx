"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Zap,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Mail,
  Lock,
  User,
  AtSign,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    loginWithEmail,
    registerWithEmail,
  } = useAuth();
  const [authMode, setAuthMode] = useState<"google" | "login" | "register">("google");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email form states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  if (!isAuthModalOpen) return null;

  const isConfigNotFound = error?.includes("configuration-not-found");
  const isUnauthorizedDomain = error?.includes("unauthorized-domain");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await signInWithGoogle();
      if (profile) {
        closeAuthModal();
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(err?.message || "গুগল সাইন-ইন সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authMode === "register") {
        if (!email || !password) {
          setError("ইমেইল এবং পাসওয়ার্ড আবশ্যক।");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
          setLoading(false);
          return;
        }
        const res = await registerWithEmail(name, email, username, password);
        if (res.success) {
          closeAuthModal();
          router.push("/admin");
          router.refresh();
        } else {
          setError(res.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
        }
      } else {
        const res = await loginWithEmail(email, password);
        if (res.success) {
          closeAuthModal();
          router.push("/admin");
          router.refresh();
        } else {
          setError(res.error || "লগইন ব্যর্থ হয়েছে।");
        }
      }
    } catch (err: any) {
      setError(err?.message || "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@linkhub.com",
          password: "admin123456",
        }),
      });
      if (res.ok) {
        closeAuthModal();
        router.push("/admin");
        router.refresh();
      } else {
        setError("ডেমো লগইন ব্যর্থ হয়েছে।");
      }
    } catch {
      setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0c101c]/95 p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 mb-3">
            <div className="w-full h-full bg-[#0c101c] rounded-[14px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Link<span className="text-indigo-400">Hub</span> Creator Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            আপনার বায়ো লিঙ্ক ও মনিটাইজেশন ড্যাশবোর্ডে প্রবেশ করুন
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/[0.08] mb-5">
          <button
            type="button"
            onClick={() => { setAuthMode("google"); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === "google"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("login"); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === "login"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ইমেইল লগইন
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("register"); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === "register"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            নতুন একাউন্ট
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs text-left space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>
                {isConfigNotFound
                  ? "Google Provider সেটআপ প্রয়োজন"
                  : isUnauthorizedDomain
                  ? "ডোমেইন অনুমোদিত (Authorized) নয়"
                  : "লগইন সমস্যা"}
              </span>
            </div>
            <p className="leading-relaxed">
              {isUnauthorizedDomain
                ? "Firebase-এ আপনার বর্তমান ডোমেইন যুক্ত নেই। নিচে 'ইমেইল লগইন' বা '১-ক্লিক ডেমো লগইন' ব্যবহার করুন অথবা Firebase Authorized Domains-এ এই ডোমেইনটি যোগ করুন।"
                : error}
            </p>
            {isUnauthorizedDomain && (
              <a
                href="https://console.firebase.google.com/project/mister-linkhub-app/authentication/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-cyan-200 underline pt-0.5"
              >
                <span>Firebase-এ ডোমেইন যুক্ত করুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* TAB 1: Google Login */}
        {authMode === "google" && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading || demoLoading}
              className="w-full relative flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all transform active:scale-98 disabled:opacity-70 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform ml-auto" />
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-white/[0.08] w-full" />
              <span className="bg-[#0c101c] px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold absolute">
                অথবা
              </span>
            </div>

            <button
              onClick={() => setAuthMode("login")}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>ইমেইল ও পাসওয়ার্ড দিয়ে সাইন ইন করুন</span>
            </button>
          </div>
        )}

        {/* TAB 2 & 3: Email Login & Register */}
        {(authMode === "login" || authMode === "register") && (
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {authMode === "register" && (
              <>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                    আপনার পুরো নাম (Full Name)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mobin X"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                    ইউজারনেম (Username / Bio Slug)
                  </label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                      placeholder="e.g. mobinx"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                ইমেইল এড্রেস (Email Address)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || demoLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>{authMode === "register" ? "একাউন্ট তৈরি করুন (Sign Up)" : "লগইন করুন (Sign In)"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 1-Click Instant Demo Login */}
        <div className="mt-4 pt-4 border-t border-white/[0.08]">
          <button
            onClick={handleInstantDemoLogin}
            disabled={loading || demoLoading}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-cyan-600/20 hover:from-indigo-600/40 hover:to-cyan-600/40 border border-indigo-500/30 text-indigo-200 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 group"
          >
            {demoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>⚡ ১-ক্লিকে সরাসরি স্টুডিওতে যান (Instant Demo)</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-slate-500 text-center mt-5">
          LinkHub Creator Studio • সব লিঙ্ক এক জায়গায়
        </p>
      </div>
    </div>
  );
}
