"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Eye,
  MousePointerClick,
  TrendingUp,
  Globe,
  Smartphone,
  Layers,
  Link2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { DynamicIcon } from "@/lib/icons";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 min-h-[50vh] flex items-center justify-center">
        Loading Analytics Engine...
      </div>
    );
  }

  const summary = stats?.summary || {
    totalViews: 0,
    totalClicks: 0,
    ctr: "0.0",
    totalPages: 0,
    totalLinks: 0,
  };

  const totalReferrersCount = stats?.referrers?.reduce((acc: number, cur: any) => acc + cur.count, 0) || 1;
  const totalDevicesCount = stats?.devices?.reduce((acc: number, cur: any) => acc + cur.count, 0) || 1;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Performance Analytics
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Detailed breakdown of page views, destination clicks, referrers, and device distribution
        </p>
      </div>

      {/* Top 3 KPI metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel relative">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Impressions</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{summary.totalViews.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1">Across all campaigns & main site</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel relative">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Outbound Clicks</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{summary.totalClicks.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1">Total external link conversions</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel relative">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Click-Through Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">{summary.ctr}%</div>
          <p className="text-xs text-slate-400 mt-1">Clicks / Impressions ratio</p>
        </div>
      </div>

      {/* Two Column Section: Referrers & Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Referrers */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Traffic Sources & Platforms</h2>
            </div>
            <span className="text-[11px] text-slate-400">TikTok, YouTube, Direct</span>
          </div>

          <div className="space-y-3">
            {stats?.referrers && stats.referrers.length > 0 ? (
              stats.referrers.map((r: any) => {
                const percent = Math.round((r.count / totalReferrersCount) * 100);
                return (
                  <div key={r.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{r.name}</span>
                      <span className="text-slate-400">
                        {r.count} views ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No traffic sources recorded yet.</p>
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white">Device Breakdown</h2>
            </div>
            <span className="text-[11px] text-slate-400">Mobile First Target</span>
          </div>

          <div className="space-y-3">
            {stats?.devices && stats.devices.length > 0 ? (
              stats.devices.map((d: any) => {
                const percent = Math.round((d.count / totalDevicesCount) * 100);
                return (
                  <div key={d.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{d.name}</span>
                      <span className="text-slate-400">
                        {d.count} sessions ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No device sessions recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Granular Link Clicks Ranking */}
      <div className="p-5 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Destination Conversion Breakdown</h2>
          </div>
          <span className="text-[11px] text-slate-400">Ranked by total clicks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-white/5">
                <th className="py-2.5 px-3 font-semibold">Destination Title</th>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold">Pages Used In</th>
                <th className="py-2.5 px-3 font-semibold text-right">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats?.topLinks && stats.topLinks.length > 0 ? (
                stats.topLinks.map((link: any) => (
                  <tr key={link.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-400">
                          <DynamicIcon name={link.icon} className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-white">{link.title}</span>
                          <span className="block text-[10px] text-slate-500 font-mono truncate max-w-xs">
                            {link.url}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-white/5 text-slate-400 text-[10px]">
                        {link.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {link._count?.pageComponents || 0} pages
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold text-emerald-400 text-sm">
                        {link.clickCount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    No link clicks recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}