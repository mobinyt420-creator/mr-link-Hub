"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Link2,
  Plus,
  Copy,
  ExternalLink,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointerClick,
  Loader2,
  Check,
  Trash2,
  BarChart3,
  Zap,
} from "lucide-react";

interface ShortLinkData {
  id: string;
  code: string;
  title: string;
  targetUrl: string;
  clickCount: number;
  uniqueClicks: number;
  earnings: number;
  isActive: boolean;
  shortUrl: string;
  createdAt: string;
}

interface StatsData {
  totalLinks: number;
  totalClicks: number;
  totalEarnings: number;
  viewsLast24h: number;
}

export default function ShortenerPage() {
  const [shortLinks, setShortLinks] = useState<ShortLinkData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalLinks: 0,
    totalClicks: 0,
    totalEarnings: 0,
    viewsLast24h: 0,
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [formUrl, setFormUrl] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formError, setFormError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/shortener/stats");
      if (res.ok) {
        const data = await res.json();
        setShortLinks(data.shortLinks);
        setStats(data.stats);
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formUrl.trim()) {
      setFormError("URL is required.");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/shortener/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl: formUrl.trim(),
          title: formTitle.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to create short link.");
        return;
      }

      // Refresh data
      await fetchData();
      setFormUrl("");
      setFormTitle("");
      setShowForm(false);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (code: string) => {
    const fullUrl = `${window.location.origin}/go/${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Link2 className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-white">Link Shortener</h1>
          </div>
          <p className="text-xs text-slate-500">
            Shorten URLs, track clicks, and earn from your traffic.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Short Link
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Total Links",
            value: stats.totalLinks,
            icon: Link2,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
            border: "border-indigo-500/20",
          },
          {
            label: "Total Clicks",
            value: stats.totalClicks.toLocaleString(),
            icon: MousePointerClick,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20",
          },
          {
            label: "Est. Earnings",
            value: `৳${stats.totalEarnings.toFixed(2)}`,
            icon: DollarSign,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
          },
          {
            label: "Views (24h)",
            value: stats.viewsLast24h.toLocaleString(),
            icon: Eye,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`glass-card rounded-xl p-4 border ${stat.border}`}
          >
            <div
              className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}
            >
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="glass-card rounded-xl p-5 mb-6 border border-indigo-500/10 animate-fade-in-up">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            Create New Short Link
          </h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Destination URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://mediafire.com/file/example..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Title (optional)
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Free Fire Config v4.2"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {formError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Shorten URL
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                }}
                className="px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Your Short Links
          </h2>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
            {shortLinks.length} links
          </span>
        </div>

        {shortLinks.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Link2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 mb-1">No short links yet</p>
            <p className="text-xs text-slate-600">
              Create your first short link to start tracking clicks and earnings.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {shortLinks.map((link) => (
              <div
                key={link.id}
                className="px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {link.title || link.code}
                      </h3>
                      {!link.isActive && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/10 text-red-400 border border-red-500/20">
                          Inactive
                        </span>
                      )}
                    </div>

                    {/* Short URL */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <code className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                        /go/{link.code}
                      </code>
                      <button
                        onClick={() => handleCopy(link.code)}
                        className="p-1 rounded-md hover:bg-white/[0.05] transition-colors"
                        title="Copy short URL"
                      >
                        {copiedId === link.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>
                    </div>

                    {/* Target URL */}
                    <p className="text-[11px] text-slate-500 truncate max-w-sm">
                      → {link.targetUrl}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div>
                      <p className="text-sm font-bold text-white">
                        {link.clickCount}
                      </p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">
                        Clicks
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-400">
                        ৳{link.earnings.toFixed(1)}
                      </p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">
                        Earned
                      </p>
                    </div>
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-500 hover:text-indigo-400 transition-all"
                      title="Open gateway page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Earnings info card */}
      <div className="mt-6 glass-card rounded-xl p-5 border border-emerald-500/10">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Earnings Estimate</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Earnings are estimated based on unique clicks. Actual earnings depend
          on your Google AdSense configuration, ad placement, and visitor
          demographics. Average eCPM for Bangladeshi traffic is ৳২০–৳৫০ per 1,000
          views. Payments are processed via bKash/Nagad when your balance reaches
          the minimum threshold.
        </p>
      </div>
    </div>
  );
}
