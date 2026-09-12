"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Zap,
  Globe,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (user) {
    router.push("/admin");
  }

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const profile = await signInWithGoogle();
      if (profile) {
        router.push("/admin");
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

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 text-center">
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
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0c101c]/90 backdrop-blur-xl p-8 shadow-2xl shadow-indigo-950/40 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-white">ক্রিয়েটর একাউন্টে প্রবেশ করুন</h1>
          <p className="text-xs text-slate-400 mt-2">
            আপনার বায়ো লিঙ্ক ম্যানেজ করুন, ট্রাফিক মনিটাইজ করুন এবং রিয়েল-টাইম এনালিটিক্স দেখুন।
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Bio Profile</p>
              <p className="text-[10px] text-slate-400">১-ক্লিক পাবলিশ</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">বিকাশ পেআউট</p>
              <p className="text-[10px] text-slate-400">SafeLink ইনকাম</p>
            </div>
          </div>
        </div>

        {/* Google Continue Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={submitting || loading}
          className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all transform active:scale-98 disabled:opacity-70 group"
        >
          {submitting || loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
          ) : (
            <>
              {/* Google SVG */}
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
      <div className="mt-8">
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
