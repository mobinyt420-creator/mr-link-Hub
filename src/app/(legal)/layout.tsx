import React from "react";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100">
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>

      <footer className="border-t border-white/[0.04] py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} LinkHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
