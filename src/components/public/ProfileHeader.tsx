import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

interface ProfileHeaderProps {
  brandName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  isExtraPage?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  accentColor?: string;
}

export default function ProfileHeader({
  brandName,
  username,
  bio,
  avatarUrl,
  isExtraPage = false,
  pageTitle,
  pageDescription,
  accentColor = "#6366f1",
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center pt-8 pb-5 px-4 w-full max-w-lg mx-auto animate-fade-in-up">
      {/* Top navigation if extra page */}
      {isExtraPage && (
        <div className="w-full flex items-center justify-between mb-5">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-white px-3.5 py-2 rounded-full glass-card glass-card-interactive active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>Main Hub</span>
          </Link>
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Dedicated Page
          </span>
        </div>
      )}

      {/* Avatar with premium glowing ring */}
      <div className="relative mb-5 group cursor-pointer">
        {/* Outer breathing glow */}
        <div
          className="absolute -inset-2.5 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-all duration-700"
          style={{
            background: `conic-gradient(from 0deg, ${accentColor}, #a855f7, #22d3ee, ${accentColor})`,
          }}
        />

        {/* Animated gradient ring */}
        <div
          className="absolute -inset-[3px] rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `conic-gradient(from 0deg, ${accentColor}, #a855f7, #22d3ee, ${accentColor})`,
          }}
        />

        {/* Avatar container */}
        <div className="relative w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden bg-slate-950 ring-[3px] ring-slate-950">
          <img
            src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
            alt={brandName}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-600"
          />
        </div>

        {/* Verified Badge */}
        <div className="absolute -bottom-0.5 -right-0.5 bg-indigo-500 text-white rounded-full p-[5px] shadow-lg shadow-indigo-500/40 ring-[2.5px] ring-slate-950">
          <ShieldCheck className="w-[14px] h-[14px]" />
        </div>
      </div>

      {/* Brand Name */}
      <h1
        className="text-[22px] sm:text-[26px] font-extrabold tracking-tight text-white mb-1"
        style={{
          textShadow: `0 0 30px ${accentColor}33`,
        }}
      >
        {brandName}
      </h1>

      {/* Username pill with live indicator */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-card text-[11px] text-slate-300 mb-3.5">
        <span className="font-medium">{username}</span>
        <span className="flex items-center gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">Official</span>
        </span>
      </div>

      {/* Bio text or Page Title */}
      {isExtraPage && pageTitle ? (
        <div className="mt-1 mb-1 glass-card rounded-xl px-4 py-2.5 w-full">
          <h2 className="text-[15px] font-bold text-indigo-300 mb-0.5 tracking-tight">{pageTitle}</h2>
          {pageDescription && (
            <p className="text-[12px] text-slate-400 leading-relaxed">{pageDescription}</p>
          )}
        </div>
      ) : (
        <p className="text-[13px] sm:text-sm text-slate-300/80 leading-relaxed max-w-xs sm:max-w-sm whitespace-pre-line">
          {bio}
        </p>
      )}
    </div>
  );
}