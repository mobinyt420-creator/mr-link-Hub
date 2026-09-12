"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Flame,
  ArrowRight,
  Loader2,
  DollarSign,
  Share2,
  Globe,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isAuthModalOpen) return null;

  const isConfigNotFound = error?.includes("configuration-not-found");

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
        setError(err?.message || "লগইন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  // Instant 1-Click Creator Demo Login
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
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0c101c]/95 p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 max-h-[90vh] overflow-y-auto"
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
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 mb-4">
            <div className="w-full h-full bg-[#0c101c] rounded-[14px] flex items-center justify-center">
              <Zap className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            LinkHub Creator Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            আপনার বায়ো লিঙ্ক তৈরি করুন, লিঙ্ক মনিটাইজ করুন এবং বিকাশ/নগদে আয় গ্রহণ করুন।
          </p>
        </div>

        {/* Creator Features Highlights */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Globe className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white">Custom Bio</p>
              <p className="text-[10px] text-slate-400">১-ক্লিকে পেইজ</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white">SafeLink আয়</p>
              <p className="text-[10px] text-slate-400">বিকাশ/নগদ পেআউট</p>
            </div>
          </div>
        </div>

        {/* Helpful error banner if Google Auth is pending in Firebase Console */}
        {error && (
          <div className="mb-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs text-left space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{isConfigNotFound ? "Google Provider অন করা প্রয়োজন" : "সাইন-ইন সমস্যা"}</span>
            </div>
            <p className="leading-relaxed">
              {isConfigNotFound ? (
                <>
                  Firebase Console-এ <strong>Authentication &gt; Sign-in method &gt; Google</strong> এনেবেল (Enable) করতে হবে।
                </>
              ) : (
                error
              )}
            </p>
            {isConfigNotFound && (
              <a
                href="https://console.firebase.google.com/project/mister-linkhub-app/authentication/providers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-cyan-200 underline pt-1"
              >
                <span>সরাসরি Firebase Console-এ Google অন করুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading || demoLoading}
            className="w-full relative flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all transform active:scale-98 disabled:opacity-70 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
            ) : (
              <>
                {/* Official Google Icon SVG */}
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

          {/* Instant 1-Click Creator Demo Login */}
          <button
            onClick={handleInstantDemoLogin}
            disabled={loading || demoLoading}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600/30 to-cyan-600/30 hover:from-indigo-600/50 hover:to-cyan-600/50 border border-indigo-500/30 text-indigo-200 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {demoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>⚡ ১-ক্লিকে সরাসরি ড্যাশবোর্ডে যান (Instant Login)</span>
              </>
            )}
          </button>
        </div>

        {/* Terms */}
        <p className="text-[11px] text-slate-500 text-center mt-6">
          সাইন-ইন করার মাধ্যমে আপনি LinkHub এর{" "}
          <a href="/terms" className="text-indigo-400 hover:underline">
            শর্তাবলী
          </a>{" "}
          এবং{" "}
          <a href="/privacy" className="text-indigo-400 hover:underline">
            গোপনীয়তা নীতি
          </a>{" "}
          মেনে নিচ্ছেন।
        </p>
      </div>
    </div>
  );
}
