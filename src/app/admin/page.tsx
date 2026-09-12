"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  MousePointerClick,
  Link2,
  FileStack,
  TrendingUp,
  ExternalLink,
  Loader2,
  BarChart3,
  Zap,
} from "lucide-react";
import { DynamicIcon } from "@/lib/icons";

interface Stats {
  totalLinks: number;
  activeLinks: number;
  totalPages: number;
  activePages: number;
  totalViews: number;
  totalClicks: number;
  recentViews: number;
  recentClicks: number;
  topLinks: { id: string; title: string; clickCount: number; icon: string }[];
  topPages: { id: string; name: string; slug: string; viewsCount: number; isMain: boolean }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  const overviewCards = [
    {
      label: "Total Views",
      value: stats?.totalViews || 0,
      recent: stats?.recentViews || 0,
      icon: Eye,
      color: "indigo",
      gradient: "from-indigo-500/15 to-indigo-600/5",
      borderColor: "border-indigo-500/20",
      iconBg: "bg-indigo-500/12",
      iconColor: "text-indigo-400",
    },
    {
      label: "Total Clicks",
      value: stats?.totalClicks || 0,
      recent: stats?.recentClicks || 0,
      icon: MousePointerClick,
      color: "purple",
      gradient: "from-purple-500/15 to-purple-600/5",
      borderColor: "border-purple-500/20",
      iconBg: "bg-purple-500/12",
      iconColor: "text-purple-400",
    },
    {
      label: "Active Links",
      value: stats?.activeLinks || 0,
      recent: stats?.totalLinks || 0,
      icon: Link2,
      color: "cyan",
      gradient: "from-cyan-500/15 to-cyan-600/5",
      borderColor: "border-cyan-500/20",
      iconBg: "bg-cyan-500/12",
      iconColor: "text-cyan-400",
    },
    {
      label: "Active Pages",
      value: stats?.activePages || 0,
      recent: stats?.totalPages || 0,
      icon: FileStack,
      color: "emerald",
      gradient: "from-emerald-500/15 to-emerald-600/5",
      borderColor: "border-emerald-500/20",
      iconBg: "bg-emerald-500/12",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-1">Overview of your LinkHub performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card) => (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} border ${card.borderColor} p-5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-2 tracking-tight">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {card.label.includes("Views") || card.label.includes("Clicks")
                    ? `${card.recent} last 7 days`
                    : `${card.recent} total`}
                </p>
              </div>
              <div className={`${card.iconBg} p-2.5 rounded-xl`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/links"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium hover:bg-indigo-500/15 transition-all"
        >
          <Zap className="w-4 h-4" />
          Manage Links
        </Link>
        <Link
          href="/admin/pages"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium hover:bg-purple-500/15 transition-all"
        >
          <FileStack className="w-4 h-4" />
          Manage Pages
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-300 text-sm font-medium hover:bg-slate-500/15 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Site Settings
        </Link>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-emerald-500/15 transition-all"
        >
          <Eye className="w-4 h-4" />
          View Live Site
        </a>
      </div>

      {/* Top Links & Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Links */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-indigo-400" />
              Top Links
            </h3>
            <Link href="/admin/links" className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {(stats?.topLinks || []).length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">No link data yet</div>
            ) : (
              stats?.topLinks.map((link, i) => (
                <div key={link.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <span className="text-[11px] font-bold text-slate-500 w-5">{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 border border-white/[0.06] flex items-center justify-center">
                    <DynamicIcon name={link.icon} className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="flex-1 text-sm text-white font-medium truncate">{link.title}</span>
                  <span className="text-xs text-slate-400 font-mono">{link.clickCount} clicks</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Pages */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileStack className="w-4 h-4 text-purple-400" />
              Top Pages
            </h3>
            <Link href="/admin/pages" className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {(stats?.topPages || []).length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">No page data yet</div>
            ) : (
              stats?.topPages.map((page, i) => (
                <div key={page.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <span className="text-[11px] font-bold text-slate-500 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-white font-medium truncate block">{page.name}</span>
                    <span className="text-[11px] text-slate-500">/{page.slug}</span>
                  </div>
                  {page.isMain && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                      MAIN
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">{page.viewsCount} views</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
