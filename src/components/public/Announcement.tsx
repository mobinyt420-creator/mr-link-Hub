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
    <div className="relative group overflow-hidden rounded-xl p-[1px] featured-card-border shadow-lg hover:shadow-indigo-500/15 transition-shadow duration-300"
      style={{
        backgroundImage: "linear-gradient(135deg, rgba(245,158,11,0.45), rgba(168,85,247,0.45), rgba(99,102,241,0.45))",
        backgroundSize: "300% 300%",
      }}
    >
      <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-[11px] bg-slate-900/85 backdrop-blur-[40px] text-xs sm:text-sm text-slate-200">
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-500/12 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/10">
          <DynamicIcon name={icon} className="w-4 h-4" />
        </div>
        <p className="flex-1 font-medium text-slate-200 line-clamp-2 sm:line-clamp-1 text-left">
          {text}
        </p>
        {url && (
          <div className="flex-shrink-0 text-slate-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all duration-200">
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );

  if (url) {
    return (
      <div className="w-full max-w-lg mx-auto mb-4 px-4 animate-fade-in-up">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block active:scale-[0.97] transition-transform duration-150">
          {content}
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto mb-4 px-4 animate-fade-in-up">
      {content}
    </div>
  );
}