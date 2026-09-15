"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Zap,
  Globe,
  DollarSign,
  ArrowRight,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Mail,
  Lock,
  User,
  AtSign,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { user, creatorProfile, signInWithGoogle, loginWithEmail, registerWithEmail, loading } = useAuth();
  const [authMode, setAuthMode] = useState<"google" | "login" | "register">("google");
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email form fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (user || creatorProfile) {
      router.push("/admin");
    }
  }, [user, creatorProfile, router]);

  const isConfigNotFound = error?.includes("configuration-not-found");
  const isUnauthorizedDomain = error?.includes("unauthorized-domain");

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const profile = await signInWithGoogle();
      if (profile) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(err?.message || "গুগল সাইন-ইন সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (authMode === "register") {
        if (!email || !password) {
          setError("ইমেইল এবং পাসওয়ার্ড আবশ্যক।");
          setSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
          setSubmitting(false);
          return;
        }
        const res = await registerWithEmail(name, email, username, password);
        if (res.success) {
          router.push("/admin");
          router.refresh();
        } else {
          setError(res.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
        }
      } else {
        const res = await loginWithEmail(email, password);
        if (res.success) {
          router.push("/admin");
          router.refresh();
        } else {
          setError(res.error || "লগইন ব্যর্থ হয়েছে।");
        }
      }
    } catch (err: any) {
      setError(err?.message || "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
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
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0c101c] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Link<span className="text-indigo-400">Hub</span>
          </span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0c101c]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 relative z-10">
        <div className="text-center mb-5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">ক্রিয়েটর একাউন্টে প্রবেশ করুন</h1>
          <p className="text-xs text-slate-400 mt-1.5">
            আপনার বায়ো লিঙ্ক ম্যানেজ করুন, ট্রাফিক মনিটাইজ করুন এবং রিয়েল-টাইম এনালিটিক্স দেখুন।
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Bio Profile</p>
              <p className="text-[10px] text-slate-400">১-ক্লিক পাবলিশ</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">বিকাশ পেআউট</p>
              <p className="text-[10px] text-slate-400">SafeLink ইনকাম</p>
            </div>
          </div>
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
          <div className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs text-left space-y-2">
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
                className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-cyan-200 underline pt-1"
              >
                <span>Firebase-এ আপনার ডোমেইন যোগ করুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Google Continue */}
        {authMode === "google" && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={submitting || demoLoading || loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all transform active:scale-98 disabled:opacity-70 group"
            >
              {submitting ? (
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
              <span>ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন</span>
            </button>
          </div>
        )}

        {/* Email Login or Register */}
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
                    ইউজারনেম (Username)
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
              disabled={submitting || demoLoading || loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
            >
              {submitting ? (
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

        {/* Instant 1-Click Creator Demo Login */}
        <div className="mt-4 pt-4 border-t border-white/[0.08]">
          <button
            onClick={handleInstantDemoLogin}
            disabled={submitting || demoLoading || loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600/30 to-cyan-600/30 hover:from-indigo-600/50 hover:to-cyan-600/50 border border-indigo-500/30 text-indigo-200 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {demoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>⚡ ১-ক্লিকে সরাসরি স্টুডিওতে প্রবেশ করুন (Instant Login)</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-slate-500 text-center mt-6">
          সাইন-ইন করার মাধ্যমে আপনি LinkHub এর{" "}
          <Link href="/terms" className="text-indigo-400 hover:underline">
            শর্তাবলী
          </Link>{" "}
          ও{" "}
          <Link href="/privacy" className="text-indigo-400 hover:underline">
            গোপনীয়তা নীতি
          </Link>{" "}
          মেনে নিচ্ছেন।
        </p>
      </div>

      {/* Back to Home */}
      <div className="mt-6">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          ← হোমপেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
