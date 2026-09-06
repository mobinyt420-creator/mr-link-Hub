import React from "react";
import Link from "next/link";
import BackgroundGlow from "@/components/public/BackgroundGlow";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative selection:bg-indigo-500 selection:text-white">
      <BackgroundGlow />
      <div className="w-full max-w-md p-8 rounded-3xl glass-card text-center flex flex-col items-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/10">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-indigo-400 mb-1.5">
          404 Error
        </span>
        <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Page Not Found</h1>
        <p className="text-[13px] text-slate-400 mb-7 leading-relaxed max-w-xs">
          The link or custom page you are looking for does not exist, has expired, or is currently inactive.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold transition-all duration-200 active:scale-95 shadow-lg shadow-indigo-600/30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Hub</span>
        </Link>
      </div>
    </div>
  );
}