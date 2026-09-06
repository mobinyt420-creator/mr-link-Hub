"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Link2,
  Eye,
  MousePointerClick,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  Edit3,
  ArrowRight,
  Globe,
  Smartphone,
} from "lucide-react";
import { DynamicIcon } from "@/lib/icons";
import { useAdminLanguage } from "@/lib/adminLanguage";

interface StatsData {
  summary: {
    totalPages: number;
    activePages: number;
    totalLinks: number;
    activeLinks: number;
    totalViews: number;
    totalClicks: number;
    ctr: string;
  };
  topPages: Array<{
    id: string;
    name: string;
    slug: string;
    isMain: boolean;
    viewsCount: number;
    isActive: boolean;
    _count: { components: number };
  }>;
  topLinks: Array<{
    id: string;
    title: string;
    url: string;
    icon: string;
    category: string;
    badge: string;
    clickCount: number;
    isActive: boolean;
    _count: { pageComponents: number };
  }>;
  referrers: Array<{ name: string; count: number }>;
  devices: Array<{ name: string; count: number }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useAdminLanguage();

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
      <div className="p-6 max-w-6xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">{t("loading")}</p>
        </div>
      </div>
    );
  }

  const summary = stats?.summary || {
    totalPages: 0,
    activePages: 0,
    totalLinks: 0,
    activeLinks: 0,
    totalViews: 0,
    totalClicks: 0,
    ctr: "0.0",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/60 border border-indigo-500/20 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {t("dashTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t("dashSubtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/pages/new"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t("dashCreatePage")}</span>
          </Link>
          <Link
            href="/admin/links"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-medium transition-all active:scale-95"
          >
            <Link2 className="w-4 h-4 text-indigo-400" />
            <span>{t("dashLinkLibrary")}</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Views */}
        <div className="p-4 rounded-2xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t("dashTotalViews")}</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {summary.totalViews.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t("dashAcrossAll")}</p>
        </div>

        {/* Total Clicks */}
        <div className="p-4 rounded-2xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t("dashLinkClicks")}</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {summary.totalClicks.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t("dashOutboundTaps")}</p>
        </div>

        {/* Click-Through Rate */}
        <div className="p-4 rounded-2xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t("dashAvgCtr")}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
            {summary.ctr}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t("dashConversionRate")}</p>
        </div>

        {/* Active Pages */}
        <div className="p-4 rounded-2xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t("dashTotalPages")}</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {summary.totalPages}
          </div>
          <p className="text-[11px] text-purple-400 mt-1">{summary.activePages} {t("dashActivePages")}</p>
        </div>
      </div>

      {/* Two Column Section: Top Pages & Top Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">{t("dashTopPages")}</h2>
            </div>
            <Link
              href="/admin/pages"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>{t("dashManageAll")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {stats?.topPages && stats.topPages.length > 0 ? (
              stats.topPages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-white truncate">
                        {page.name}
                      </span>
                      {page.isMain ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          MAIN
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">
                          /{page.slug}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {page._count.components} {t("dashComponentsCount")} • {page.isActive ? t("linksActiveStatus") : t("linksInactiveStatus")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-white">{page.viewsCount}</span>
                      <span className="text-[10px] text-slate-400 block">{t("dashViews")}</span>
                    </div>

                    <Link
                      href={page.isMain ? "/admin/main-site" : `/admin/pages/${page.id}/edit`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                      title="Edit Page"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href={page.isMain ? "/" : `/${page.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Open Live Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">{t("dashNoData")}</p>
            )}
          </div>
        </div>

        {/* Top Links */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">{t("dashTopLinks")}</h2>
            </div>
            <Link
              href="/admin/links"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>{t("dashViewLibrary")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {stats?.topLinks && stats.topLinks.length > 0 ? (
              stats.topLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <DynamicIcon name={link.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-white truncate">
                          {link.title}
                        </span>
                        {link.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {t("dashUsedIn")} {link._count.pageComponents} {t("dashComponentsCount")} • {link.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-3">
                    <span className="text-xs font-bold text-emerald-400">{link.clickCount}</span>
                    <span className="text-[10px] text-slate-400 block">{t("dashClicks")}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">{t("dashNoData")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Traffic Sources & Device Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Referrers */}
        <div className="p-5 rounded-2xl glass-panel">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>{t("dashTrafficSources")}</span>
          </h3>
          <div className="space-y-2">
            {stats?.referrers && stats.referrers.length > 0 ? (
              stats.referrers.map((ref) => (
                <div key={ref.name} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-slate-300 font-medium">{ref.name}</span>
                  <span className="font-semibold text-indigo-400">{ref.count} {t("dashViews")}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-2">{t("dashNoData")}</p>
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="p-5 rounded-2xl glass-panel">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>{t("dashVisitorDevices")}</span>
          </h3>
          <div className="space-y-2">
            {stats?.devices && stats.devices.length > 0 ? (
              stats.devices.map((dev) => (
                <div key={dev.name} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-slate-300 font-medium">{dev.name}</span>
                  <span className="font-semibold text-purple-400">{dev.count} {t("dashSessions")}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-2">{t("dashNoData")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}