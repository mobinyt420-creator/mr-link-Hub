"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SiteHeaderProps {
  currentPath?: string;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader({ currentPath }: SiteHeaderProps) {
  const { user, creatorProfile, openAuthModal, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0d14]/85 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">
            Link<span className="text-indigo-400">Hub</span>
          </span>
        </Link>

        {/* Navigation & Auth Actions */}
        <div className="flex items-center gap-3">
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-all"
              >
                {creatorProfile?.photoURL || user.photoURL ? (
                  <img
                    src={creatorProfile?.photoURL || user.photoURL || ""}
                    alt={user.displayName || "User"}
                    className="w-6 h-6 rounded-full object-cover border border-indigo-400/30"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                    {user.displayName?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-xs font-semibold text-white max-w-[90px] truncate hidden sm:inline">
                  {user.displayName || "Creator"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0e1322] border border-white/10 shadow-2xl p-1.5 z-50 animate-fade-in"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                    <p className="text-xs font-bold text-white truncate">
                      {user.displayName || "Creator"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                    <span>ড্যাশবোর্ড (Admin)</span>
                  </Link>

                  {creatorProfile?.username && (
                    <Link
                      href={`/u/${creatorProfile.username}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors"
                    >
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>আমার প্রোফাইল (/u/{creatorProfile.username})</span>
                    </Link>
                  )}

                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-500/10 transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>লগআউট (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>লগইন / Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
