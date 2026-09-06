"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Link2,
  Layers,
  Globe,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";
import { useAdminLanguage, LanguageSwitcherButton } from "@/lib/adminLanguage";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useAdminLanguage();

  // If on login page, don't show navigation
  if (pathname === "/admin/login") return null;

  const navItems = [
    { label: t("navDashboard"), href: "/admin/dashboard", icon: LayoutDashboard },
    { label: t("navLinks"), href: "/admin/links", icon: Link2 },
    { label: t("navPages"), href: "/admin/pages", icon: Layers },
    { label: t("navMainSite"), href: "/admin/main-site", icon: Globe },
    { label: t("navAnalytics"), href: "/admin/analytics", icon: BarChart3 },
    { label: t("navSettings"), href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
            LX
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">LinkHub Admin</h1>
            <span className="text-[10px] text-indigo-400 font-medium">{t("navControlCenter")}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcherButton />
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            title="View Live Site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[57px] z-30 bg-slate-950/95 border-b border-white/10 p-4 flex flex-col gap-1 backdrop-blur-2xl animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between">
            <Link
              href="/admin/pages/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-medium text-indigo-400 py-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t("navCreatePage")}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 py-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("navSignOut")}</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-40 bg-slate-950 border-r border-white/10 p-5">
        {/* Brand */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-600/30">
              LX
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">LinkHub CMS</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t("navProductionLive")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Language Switcher in Sidebar */}
        <div className="mb-4 px-1 flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5">
          <span className="text-[11px] text-slate-400 font-medium">Language / ভাষা</span>
          <LanguageSwitcherButton />
        </div>

        {/* Quick Action Button */}
        <Link
          href="/admin/pages/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 mb-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t("navCreatePage")}</span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600/90 text-white shadow-md shadow-indigo-600/20 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="pt-4 mt-auto border-t border-white/10 flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t("navViewHub")}</span>
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-mono">{t("navPublic")}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t("navSignOut")}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Dock (Phone navigation) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition-all ${
                isActive ? "text-indigo-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400 stroke-[2.5]" : "text-slate-400"}`} />
              <span className="truncate max-w-[54px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}