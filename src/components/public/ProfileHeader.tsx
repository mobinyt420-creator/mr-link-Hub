import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";
import { DynamicIcon } from "@/lib/icons";

interface ProfileHeaderProps {
  brandName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  isExtraPage?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  pageIcon?: string;
  accentColor?: string;
}

// Detect platform from page name/title/slug
function detectPlatform(title?: string, description?: string): {
  icon: string;
  label: string;
  color: string;
  bgClass: string;
} {
  const t = (title || "").toLowerCase() + " " + (description || "").toLowerCase();
  if (t.includes("tiktok")) return { icon: "TikTok", label: "TikTok", color: "#FE2C55", bgClass: "from-[#FE2C55]/15 to-[#25F4EE]/10 border-[#FE2C55]/25" };
  if (t.includes("youtube")) return { icon: "Youtube", label: "YouTube", color: "#FF0000", bgClass: "from-[#FF0000]/15 to-[#FF4444]/10 border-[#FF0000]/25" };
  if (t.includes("facebook")) return { icon: "Facebook", label: "Facebook", color: "#1877F2", bgClass: "from-[#1877F2]/15 to-[#4C98F7]/10 border-[#1877F2]/25" };
  if (t.includes("instagram")) return { icon: "Instagram", label: "Instagram", color: "#E1306C", bgClass: "from-[#E1306C]/15 to-[#833AB4]/10 border-[#E1306C]/25" };
  if (t.includes("telegram")) return { icon: "Telegram", label: "Telegram", color: "#229ED9", bgClass: "from-[#229ED9]/15 to-[#229ED9]/10 border-[#229ED9]/25" };
  if (t.includes("whatsapp")) return { icon: "WhatsApp", label: "WhatsApp", color: "#25D366", bgClass: "from-[#25D366]/15 to-[#25D366]/10 border-[#25D366]/25" };
  return { icon: "Sparkles", label: "Exclusive", color: "#6366f1", bgClass: "from-indigo-500/15 to-purple-500/10 border-indigo-500/25" };
}

export default function ProfileHeader({
  brandName,
  username,
  bio,
  avatarUrl,
  isExtraPage = false,
  pageTitle,
  pageDescription,
  pageIcon,
  accentColor = "#6366f1",
}: ProfileHeaderProps) {
  const platform = isExtraPage ? detectPlatform(pageTitle, pageDescription) : null;

  return (
    <div className="flex flex-col items-center text-center pt-10 pb-4 px-4 w-full max-w-lg mx-auto animate-fade-in-up">
      {/* Top navigation if extra page */}
      {isExtraPage && (
        <div className="w-full flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-white px-3.5 py-2 rounded-full glass-card glass-card-interactive active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>Main Hub</span>
          </Link>
        </div>
      )}

      {/* Avatar with premium glowing ring */}
      <div className="relative mb-5 group cursor-pointer">
        {/* Outer breathing glow — large diffuse */}
        <div
          className="absolute -inset-3.5 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-700 animate-breathe"
          style={{
            background: `conic-gradient(from 0deg, ${accentColor}, #a855f7, #22d3ee, ${accentColor})`,
          }}
        />

        {/* Animated gradient ring */}
        <div
          className="absolute -inset-[3px] rounded-full opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow"
          style={{
            background: `conic-gradient(from 0deg, ${accentColor}, #a855f7, #22d3ee, #ec4899, ${accentColor})`,
          }}
        />

        {/* Avatar container */}
        <div className="relative w-[92px] h-[92px] sm:w-[104px] sm:h-[104px] rounded-full overflow-hidden bg-slate-950 ring-[3px] ring-slate-950">
          <img
            src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
            alt={brandName}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-600"
          />
        </div>

        {/* Verified Badge */}
        <div
          className="absolute -bottom-0.5 -right-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full p-[5px] shadow-lg ring-[2.5px] ring-slate-950"
          style={{ boxShadow: `0 0 16px -2px ${accentColor}66` }}
        >
          <ShieldCheck className="w-[14px] h-[14px]" />
        </div>
      </div>

      {/* Brand Name */}
      <h1
        className="text-[24px] sm:text-[28px] font-extrabold tracking-tight text-white mb-1.5"
        style={{
          textShadow: `0 0 40px ${accentColor}33, 0 0 80px ${accentColor}15`,
        }}
      >
        {brandName}
      </h1>

      {/* Username pill with Online indicator */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-card text-[11px] text-slate-300 mb-2">
        <span className="font-semibold">{username}</span>
        <span className="w-[1px] h-3 bg-white/10" />
        <span className="flex items-center gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">Online</span>
        </span>
      </div>

      {/* Platform-branded page header for extra pages */}
      {isExtraPage && pageTitle && platform && (
        <div
          className={`mt-3 mb-1 w-full rounded-2xl bg-gradient-to-br ${platform.bgClass} border p-4 animate-fade-in-scale`}
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex items-center gap-3">
            {/* Platform icon — bigger, clear */}
            <div className="w-11 h-11 rounded-xl bg-black/20 flex items-center justify-center flex-shrink-0">
              <DynamicIcon name={pageIcon || platform.icon} className="w-7 h-7" size={28} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <h2 className="text-[15px] font-bold text-white tracking-tight">{pageTitle}</h2>
              {pageDescription && (
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{pageDescription}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}