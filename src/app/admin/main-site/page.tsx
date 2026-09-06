"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, ArrowRight } from "lucide-react";

export default function AdminMainSiteRedirect() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMainSite() {
      try {
        const res = await fetch("/api/pages");
        if (!res.ok) throw new Error("Failed to load pages");
        const data = await res.json();
        const mainPage = data.pages?.find((p: any) => p.isMain);
        if (mainPage) {
          router.replace(`/admin/pages/${mainPage.id}/edit`);
        } else {
          setError("Main Website record not found. Please run seed script or create a page.");
        }
      } catch {
        setError("Error loading Main Website manager.");
      }
    }
    loadMainSite();
  }, [router]);

  return (
    <div className="p-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4 animate-pulse">
        <Globe className="w-6 h-6" />
      </div>
      <h2 className="text-base font-bold text-white mb-1">Opening Main Website Builder...</h2>
      <p className="text-xs text-slate-400">Loading permanent digital presence configuration</p>
      {error && (
        <p className="text-xs text-red-400 mt-4 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
          {error}
        </p>
      )}
    </div>
  );
}