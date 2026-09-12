import React from "react";
import { Sparkles } from "lucide-react";

interface PublicFooterProps {
  footerText?: string;
  brandName?: string;
}

export default function PublicFooter({
  footerText = "© 2026 Mobin X. All rights reserved.",
  brandName = "Mobin X",
}: PublicFooterProps) {
  return (
    <footer className="mt-auto pt-10 pb-8 text-center flex flex-col items-center gap-3 border-t border-white/[0.03] relative">
      {/* Subtle glow line at border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      
      <p className="text-[11px] text-slate-500 tracking-wide max-w-xs">{footerText}</p>
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-indigo-500/50" />
        <span className="text-[10px] text-slate-600">
          Powered by <strong className="text-slate-400 font-medium">LinkHub Platform</strong>
        </span>
      </div>
    </footer>
  );
}