import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import BackgroundGlow from "@/components/public/BackgroundGlow";

export const metadata = {
  title: "Admin Panel — LinkHub Platform",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-indigo-500 selection:text-white">
      <BackgroundGlow accentColor="#6366f1" />
      <AdminShell>{children}</AdminShell>
    </div>
  );
}