"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Link2,
  FileStack,
  Settings,
  LogOut,
  Menu,
  Zap,
  Loader2,
  ChevronRight,
  Scissors,
  ExternalLink,
  Globe,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface CreatorUser {
  id: string;
  email: string;
  name: string;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Overview & Analytics", icon: LayoutDashboard },
  { href: "/admin/links", label: "My Links (লিঙ্কসমূহ)", icon: Link2 },
  { href: "/admin/pages", label: "Bio Pages (পেইজসমূহ)", icon: FileStack },
  { href: "/admin/shortener", label: "SafeLink & Earnings", icon: Scissors },
  { href: "/admin/settings", label: "Profile & Theme", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user: firebaseUser, creatorProfile, logout: firebaseLogout } = useAuth();
  const [user, setUser] = useState<CreatorUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Skip auth check on login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser({
            id: "default-creator",
            email: "admin@linkhub.com",
            name: "Creator",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setUser({
          id: "default-creator",
          email: "admin@linkhub.com",
          name: "Creator",
        });
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isLoginPage]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await firebaseLogout();
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    } finally {
      window.location.href = "/admin/login";
    }
  };

  // Login page renders without layout
  if (isLoginPage) return <>{children}</>;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06080d]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <span className="text-xs text-slate-400 font-medium">ক্রিয়েটর স্টুডিও লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  const username = creatorProfile?.username || "mobin";
  const displayName = creatorProfile?.displayName || user?.name || "Creator";
  const avatarUrl = creatorProfile?.photoURL || firebaseUser?.photoURL || "";

  return (
    <div className="min-h-screen bg-[#06080d] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[270px] bg-[#0a0d14] border-r border-white/[0.06] flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1.5">
                <span>LinkHub</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">STUDIO</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Creator Dashboard</p>
            </div>
          </div>

          {/* Quick Link to Live Bio Page */}
          <Link
            href={`/u/${username}`}
            target="_blank"
            className="mt-4 w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-xs font-semibold text-indigo-300 transition-all group"
          >
            <div className="flex items-center gap-2 truncate">
              <Globe className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="truncate">linkhub.app/u/{username}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-200 border border-indigo-500/30 shadow-md shadow-indigo-950/40"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Creator Profile Card + Logout */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 mb-3 px-1">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-9 h-9 rounded-xl object-cover border border-indigo-400/30"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || firebaseUser?.email || "Creator"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 border border-rose-500/15 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? "লগআউট হচ্ছে..." : "লগআউট (Logout)"}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-30 lg:hidden bg-[#0a0d14]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-white">LinkHub Creator Studio</span>
          </div>
          <Link
            href={`/u/${username}`}
            target="_blank"
            className="p-2 rounded-lg bg-white/[0.05] text-indigo-300 text-xs font-semibold flex items-center gap-1"
          >
            <span>Live Bio</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
