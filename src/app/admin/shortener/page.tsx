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
  CreditCard,
  Send,
  History,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  HelpCircle,
  PlayCircle,
  Wallet,
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

interface PayoutRecord {
  id: string;
  date: string;
  method: "bKash" | "Nagad" | "Rocket" | "Bank";
  accountNumber: string;
  accountType: "Personal" | "Agent";
  amount: number;
  status: "Paid" | "Processing" | "Pending";
}

const DEFAULT_PAYOUT_HISTORY: PayoutRecord[] = [
  {
    id: "TXN-BK9281",
    date: "2026-09-10 14:30",
    method: "bKash",
    accountNumber: "01789-XXXXXX",
    accountType: "Personal",
    amount: 1250,
    status: "Paid",
  },
  {
    id: "TXN-NG4512",
    date: "2026-09-05 19:15",
    method: "Nagad",
    accountNumber: "01812-XXXXXX",
    accountType: "Personal",
    amount: 850,
    status: "Paid",
  },
];

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

  // Active Tab: 'links' | 'payouts'
  const [activeTab, setActiveTab] = useState<"links" | "payouts">("links");

  // Form state
  const [formUrl, setFormUrl] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formError, setFormError] = useState("");

  // Payout State
  const [payoutMethod, setPayoutMethod] = useState<"bKash" | "Nagad" | "Rocket" | "Bank">("bKash");
  const [accountType, setAccountType] = useState<"Personal" | "Agent">("Personal");
  const [payoutNumber, setPayoutNumber] = useState("");
  const [payoutAmount, setPayoutAmount] = useState<string>("");
  const [payoutSubmitting, setPayoutSubmitting] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState("");
  const [payoutErrorMsg, setPayoutErrorMsg] = useState("");
  const [payoutHistory, setPayoutHistory] = useState<PayoutRecord[]>(DEFAULT_PAYOUT_HISTORY);

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
      setFormError("আসল URL দিন (URL is required).");
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

      setFormUrl("");
      setFormTitle("");
      setShowForm(false);
      fetchData();
    } catch {
      setFormError("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    const fullUrl = `${window.location.origin}${text}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Payout Request Submit
  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutErrorMsg("");
    setPayoutSuccessMsg("");

    const num = payoutNumber.trim();
    const amt = parseFloat(payoutAmount);

    if (!num || num.length < 11) {
      setPayoutErrorMsg("সঠিক ১১ ডিজিটের মোবাইল একাউন্ট নাম্বার দিন (যেমন: 017XXXXXXXX)");
      return;
    }

    if (isNaN(amt) || amt < 500) {
      setPayoutErrorMsg("সর্বনিম্ন উত্তোলনের পরিমাণ ৫০০ টাকা হতে হবে।");
      return;
    }

    setPayoutSubmitting(true);

    setTimeout(() => {
      const newRecord: PayoutRecord = {
        id: `TXN-${payoutMethod.toUpperCase().slice(0, 2)}${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().replace("T", " ").slice(0, 16),
        method: payoutMethod,
        accountNumber: num,
        accountType: accountType,
        amount: amt,
        status: "Processing",
      };

      setPayoutHistory((prev) => [newRecord, ...prev]);
      setPayoutSuccessMsg(`✓ ৳${amt.toLocaleString()} টাকার উত্তোলনের রিকোয়েস্ট সফলভাবে জমা হয়েছে (${payoutMethod})। ২৪ ঘণ্টার মধ্যে একাউন্টে যুক্ত হবে।`);
      setPayoutNumber("");
      setPayoutAmount("");
      setPayoutSubmitting(false);
    }, 800);
  };

  const cpmRate = 850; // ৳850 per 1k views ($7.50 CPM)

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* ═══════ HEADER ═══════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              2-Step Monetization Gateway
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-medium text-indigo-300">
              CPM: ৳{cpmRate}/1K
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            লিংক শর্টনার ও ক্রিয়েটর আর্নিংস
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            লিংক শর্ট করুন, ২-স্টেপ অ্যাড ভিউ থেকে ইনকাম করুন এবং সরাসরি বিকাশ ও নগদে উত্তোলন করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            নতুন লিংক শর্ট করুন
          </button>
        </div>
      </div>

      {/* ═══════ STATS OVERVIEW CARDS ═══════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Links */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.06] relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">মোট লিংক</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            {stats.totalLinks}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">সক্রিয় শর্ট লিংক</span>
        </div>

        {/* Total Clicks */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.06] relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">মোট ক্লিক</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            {stats.totalClicks}
          </div>
          <span className="text-[10px] text-cyan-400/80 mt-1 block">
            {stats.viewsLast24h} ভিউ (গত ২৪ ঘণ্টায়)
          </span>
        </div>

        {/* Total Earnings (BDT) */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-emerald-500/20 bg-emerald-950/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-400">মোট আয় (BDT)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-emerald-300 font-bold text-sm">৳</span>
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            ৳{stats.totalEarnings.toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-400/80 mt-1 block">
            ≈ ${(stats.totalEarnings / 115).toFixed(2)} USD
          </span>
        </div>

        {/* Active CPM Rate */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-purple-500/20 bg-purple-950/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purple-300">গড় CPM রেট</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-300" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            ৳{cpmRate}
          </div>
          <span className="text-[10px] text-purple-400/80 mt-1 block">
            প্রতি ১,০০০ ভেরিফাইড ভিজিটর
          </span>
        </div>
      </div>

      {/* ═══════ CREATE SHORT LINK MODAL/DRAWER ═══════ */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/20 shadow-2xl animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              নতুন মনিটাইজড ডাউনলোড লিঙ্ক তৈরি করুন
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              বন্ধ করুন ✕
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                আসল ডাউনলোড লিঙ্ক (Target URL) *
              </label>
              <input
                type="url"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://www.mediafire.com/file/... অথবা Google Drive লিঙ্ক"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ফাইলের নাম বা শিরোনাম (Title / Label)
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="যেমন: Free Fire Top Up Config v4.2"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    তৈরি হচ্ছে...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    শর্ট লিঙ্ক তৈরি করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ═══════ NAVIGATION TABS (LINKS VS WITHDRAWAL) ═══════ */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
        <button
          onClick={() => setActiveTab("links")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "links"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>শর্ট লিঙ্কসমূহ ({shortLinks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("payouts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "payouts"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>বিকাশ ও নগদ উইথড্রল (Payouts)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* ═══════ TAB 1: SHORT LINKS TABLE ═══════ */}
      {activeTab === "links" && (
        <div className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              আপনার সক্রিয় শর্ট লিংকসমূহ
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              সর্বমোট {shortLinks.length}টি লিংক
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          ) : shortLinks.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                <Link2 className="w-6 h-6 text-indigo-400" />
              </div>
              <p className="text-sm font-semibold text-slate-300">কোনো শর্ট লিংক তৈরি করা হয়নি</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                উপরে &quot;নতুন লিংক শর্ট করুন&quot; বাটনে ক্লিক করে প্রথম লিংকটি তৈরি করুন।
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-3.5">শর্ট কোড ও লিঙ্ক</th>
                    <th className="px-6 py-3.5">শিরোনাম ও আসল URL</th>
                    <th className="px-6 py-3.5 text-center">ক্লিক / ভিউ</th>
                    <th className="px-6 py-3.5 text-center">ইউনিক ভিজিটর</th>
                    <th className="px-6 py-3.5 text-center">আয় (BDT)</th>
                    <th className="px-6 py-3.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {shortLinks.map((link) => (
                    <tr
                      key={link.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Code & Copy */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono font-bold">
                            {link.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(link.shortUrl, link.id)}
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                            title="লিঙ্ক কপি করুন"
                          >
                            {copiedId === link.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Title & Target */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-200 mb-0.5">
                          {link.title || "Untitled Download Link"}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
                          {link.targetUrl}
                        </div>
                      </td>

                      {/* Clicks */}
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-white tabular-nums">
                          {link.clickCount}
                        </span>
                      </td>

                      {/* Unique Clicks */}
                      <td className="px-6 py-4 text-center">
                        <span className="font-medium text-cyan-400 tabular-nums">
                          {link.uniqueClicks}
                        </span>
                      </td>

                      {/* Earnings */}
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-emerald-400 tabular-nums">
                          ৳{link.earnings.toFixed(2)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 1-Click Test Flow Button */}
                          <a
                            href={link.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px] transition-all hover:scale-105"
                            title="২-স্টেপ সেফলিঙ্ক ফ্লো সরাসরি টেস্ট করুন"
                          >
                            <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Test Flow 🧪</span>
                          </a>

                          <a
                            href={link.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                            title="আসল ফাইলে যান"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══════ TAB 2: BKASH / NAGAD WITHDRAWAL MODULE ═══════ */}
      {activeTab === "payouts" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up">
          {/* Left: Withdrawal Request Form */}
          <div className="lg:col-span-6 glass-card rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-slate-900/40">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  টাকা উত্তোলনের আবেদন (Withdraw Funds)
                </h3>
                <p className="text-[11px] text-slate-400">
                  বিকাশ, নগদ বা রকেটের মাধ্যমে সরাসরি আপনার একাউন্টে পেমেন্ট নিন।
                </p>
              </div>
            </div>

            {payoutSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{payoutSuccessMsg}</span>
              </div>
            )}

            {payoutErrorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {payoutErrorMsg}
              </div>
            )}

            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  ১. পেমেন্ট মাধ্যম নির্বাচন করুন (Payment Method)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("bKash")}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      payoutMethod === "bKash"
                        ? "bg-[#d12053]/20 border-[#d12053] text-pink-300 shadow-lg shadow-[#d12053]/10"
                        : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="text-sm">💖</span>
                    <span>bKash (বিকাশ)</span>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("Nagad")}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      payoutMethod === "Nagad"
                        ? "bg-[#f7931e]/20 border-[#f7931e] text-orange-300 shadow-lg shadow-[#f7931e]/10"
                        : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="text-sm">🧡</span>
                    <span>Nagad (নগদ)</span>
                  </button>

                  {/* Rocket */}
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("Rocket")}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      payoutMethod === "Rocket"
                        ? "bg-[#8c3894]/20 border-[#8c3894] text-purple-300 shadow-lg shadow-[#8c3894]/10"
                        : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="text-sm">💜</span>
                    <span>Rocket (রকেট)</span>
                  </button>
                </div>
              </div>

              {/* Account Type (Personal / Agent) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ২. একাউন্টের ধরন (Account Type)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === "Personal"}
                      onChange={() => setAccountType("Personal")}
                      className="accent-emerald-500"
                    />
                    <span>Personal (ব্যক্তিগত)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === "Agent"}
                      onChange={() => setAccountType("Agent")}
                      className="accent-emerald-500"
                    />
                    <span>Agent (এজেন্ট)</span>
                  </label>
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ৩. {payoutMethod} একাউন্ট নাম্বার (Account Number) *
                </label>
                <input
                  type="text"
                  value={payoutNumber}
                  onChange={(e) => setPayoutNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  maxLength={11}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Amount */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    ৪. টাকার পরিমাণ (Amount in BDT) *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    সর্বনিম্ন: ৳৫০০
                  </span>
                </div>
                <input
                  type="number"
                  min="500"
                  step="50"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="যেমন: 1000"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />

                {/* Quick amount chips */}
                <div className="flex items-center gap-2 mt-2">
                  {["500", "1000", "2500", "5000"].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPayoutAmount(amt)}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-slate-300 font-mono transition-colors"
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={payoutSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {payoutSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>প্রসেসিং হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>টাকা উত্তোলনের রিকোয়েস্ট পাঠান ➜</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Payout History & Payout Guidelines */}
          <div className="lg:col-span-6 space-y-6">
            {/* Policy & Info Card */}
            <div className="glass-card rounded-2xl p-5 border border-white/[0.06] bg-white/[0.02]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                পেমেন্ট সংক্রান্ত নিয়ম ও তথ্য
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>উইথড্রল রিকোয়েস্ট দেওয়ার ২৪ ঘণ্টার মধ্যে বিকাশ/নগদে টাকা পাঠানো হয়।</li>
                <li>কোনো ক্যাশ-আউট বা অতিরিক্ত চার্জ কাটা হবে না (০% ফি)।</li>
                <li>প্রতি ১,০০০ সফল ২-স্টেপ ডাউনলোডে গড় আর্নিং <strong>৳৮৫০ (CPM $7.50)</strong>।</li>
              </ul>
            </div>

            {/* Payout History Log */}
            <div className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <History className="w-4 h-4 text-indigo-400" />
                  উইথড্রল ট্রানজেকশন হিস্ট্রি
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">
                  {payoutHistory.length}টি রেকর্ড
                </span>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {payoutHistory.map((item) => (
                  <div
                    key={item.id}
                    className="px-5 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">
                          {item.method} ({item.accountType})
                        </span>
                        <code className="text-[10px] text-slate-400 font-mono">
                          {item.accountNumber}
                        </code>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {item.date} • {item.id}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-xs text-emerald-400 font-mono">
                        +৳{item.amount.toLocaleString()}
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-0.5 ${
                          item.status === "Paid"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                        }`}
                      >
                        {item.status === "Paid" ? "✓ সফল (Paid)" : "⏳ প্রসেসিং"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
