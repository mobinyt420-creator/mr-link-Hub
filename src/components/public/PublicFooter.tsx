import React from "react";

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
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-600">
          Powered by <strong className="text-slate-400 font-medium">LinkHub Platform</strong>
        </span>
      </div>
    </footer>
  );
}