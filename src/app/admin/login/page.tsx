"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, AlertCircle, ArrowRight, Zap, Globe, DollarSign, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signInWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      window.location.href = "/admin";
    }
  }, [user]);

  const isUnauthorizedDomain = error?.includes("unauthorized-domain");
  const isConfigNotFound = error?.includes("configuration-not-found");

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
      console.error(err);
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(err?.message || "গুগল সাইন-ইন সম্পন্ন করা যায়নি।");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Instant 1-Click Creator Access
  const handleInstantCreatorLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@linkhub.com",
          password: "admin123456",
        }),
      });

      if (!res.ok) {
        setError("লগইন ব্যর্থ হয়েছে।");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#06080d]">
      {/* Background Gradients */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-indigo-600/15 blur-[180px] -z-10" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[140px] -z-10" />

      <div className="w-full max-w-[420px] animate-fade-in-up">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/25 mb-4">
            <div className="w-full h-full bg-[#0c101c] rounded-[14px] flex items-center justify-center">
              <Zap className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">LinkHub Creator Studio</h1>
          <p className="text-xs text-slate-400 mt-1.5">আপনার পার্সোনাল লিঙ্ক ও বায়ো পেজ পরিচালনা করুন</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-white/10 shadow-2xl bg-[#0c101c]/90 backdrop-blur-xl">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs text-left space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>
                  {isUnauthorizedDomain
                    ? "ডোমেইন অনুমোদিত (Authorized) নয়"
                    : isConfigNotFound
                    ? "Google Provider অন করা প্রয়োজন"
                    : "লগইন সমস্যা"}
                </span>
              </div>
              <p className="leading-relaxed">
                {isUnauthorizedDomain ? (
                  <>
                    আপনি যে ডোমেইন (যেমন Vercel লিঙ্ক) থেকে ভিজিট করছেন, সেটি Firebase-এর অনুমোদিত ডোমেইন তালিকায় যোগ করতে হবে।
                  </>
                ) : (
                  error
                )}
              </p>
              {isUnauthorizedDomain && (
                <a
                  href="https://console.firebase.google.com/project/mister-linkhub-app/authentication/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-cyan-200 underline pt-1"
                >
                  <span>Firebase-এ আপনার ডোমেইন যোগ করুন (Authorized Domains)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Value props for creator */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Globe className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-white">Bio Profile</p>
                <p className="text-[10px] text-slate-400">আপনার লিঙ্ক হাব</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-white">SafeLink আয়</p>
                <p className="text-[10px] text-slate-400">বিকাশ পেআউট</p>
              </div>
            </div>
          </div>

          {/* Primary Action: Continue with Google */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group transform active:scale-98"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
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

            {/* Instant 1-Click Creator Studio Access */}
            <button
              type="button"
              onClick={handleInstantCreatorLogin}
              disabled={loading || googleLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600/30 to-cyan-600/30 hover:from-indigo-600/50 hover:to-cyan-600/50 border border-indigo-500/30 text-indigo-200 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
              ) : (
                <>
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>⚡ ১-ক্লিকে সরাসরি স্টুডিওতে যান (Instant Access)</span>
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-500 pt-2">
            ক্রিয়েটর একাউন্ট তৈরি বা লগইন করতে গুগল সাইন-ইন ব্যবহার করুন।
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5">
            ← হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
