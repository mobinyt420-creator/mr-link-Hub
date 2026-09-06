import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

interface PublicFooterProps {
  footerText?: string;
  brandName?: string;
}

export default function PublicFooter({
  footerText = "© 2026 Mobin X. All rights reserved.",
  brandName = "Mobin X",
}: PublicFooterProps) {
  return (
    <footer className="mt-auto py-8 text-center flex flex-col items-center gap-2.5 border-t border-white/[0.03]">
      <p className="text-[10.5px] text-slate-500 tracking-wide">{footerText}</p>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-slate-600">
          Powered by <strong className="text-slate-500 font-medium">LinkHub Platform</strong>
        </span>
        <span className="text-slate-700/50">•</span>
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-300 transition-colors px-2 py-0.5 rounded-full hover:bg-slate-800/50"
          title="Admin CMS Login"
        >
          <Lock className="w-2.5 h-2.5" />
          <span>Admin</span>
        </Link>
      </div>
    </footer>
  );
}