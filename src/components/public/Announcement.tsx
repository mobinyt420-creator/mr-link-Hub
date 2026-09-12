"use client";

import React from "react";
import { DynamicIcon } from "@/lib/icons";
import { ArrowRight } from "lucide-react";

interface AnnouncementProps {
  text: string;
  url?: string;
  icon?: string;
}

export default function Announcement({ text, url, icon = "Flame" }: AnnouncementProps) {
  if (!text) return null;

  const content = (
    <div
      className="relative group overflow-hidden rounded-2xl p-[1.5px] featured-card-border shadow-lg hover:shadow-indigo-500/15 transition-shadow duration-300"
      style={{
        backgroundImage: "linear-gradient(135deg, rgba(245,158,11,0.5), rgba(168,85,247,0.5), rgba(99,102,241,0.5), rgba(236,72,153,0.3))",
        backgroundSize: "300% 300%",
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-[14.5px] bg-slate-900/90 backdrop-blur-[50px]">
        {/* Animated icon container */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/10 animate-breathe">
          <DynamicIcon name={icon} className="w-4 h-4" />
        </div>

        {/* Text */}
        <p className="flex-1 font-medium text-slate-200 text-xs sm:text-sm line-clamp-2 sm:line-clamp-1 text-left leading-relaxed">
          {text}
        </p>

        {/* Arrow */}
        {url && (
          <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-400 group-hover:text-indigo-300 group-hover:border-indigo-500/20 group-hover:bg-indigo-500/10 group-hover:translate-x-0.5 transition-all duration-200">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  );

  if (url) {
    return (
      <div className="w-full max-w-lg mx-auto mb-5 px-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <a href={url} target="_blank" rel="noopener noreferrer" className="block active:scale-[0.97] transition-transform duration-150">
          {content}
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto mb-5 px-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
      {content}
    </div>
  );
}