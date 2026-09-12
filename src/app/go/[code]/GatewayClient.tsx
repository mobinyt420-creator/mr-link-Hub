"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  Shield,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Eye,
  Zap,
  BookOpen,
  User,
  Loader2,
} from "lucide-react";

interface ArticleData {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  readTime: number;
  coverImage: string;
}

interface GatewayClientProps {
  shortCode: string;
  shortLinkId: string;
  targetUrl: string;
  linkTitle: string;
  article: ArticleData | null;
}

const COUNTDOWN_SECONDS = 8;

export default function GatewayClient({
  shortCode,
  shortLinkId,
  targetUrl,
  linkTitle,
  article,
}: GatewayClientProps) {
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  const [isReady, setIsReady] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [viewRegistered, setViewRegistered] = useState(false);

  // Register gateway view on mount
  useEffect(() => {
    if (viewRegistered) return;
    setViewRegistered(true);

    fetch("/api/shortener/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shortLinkId,
        articleId: article?.id || null,
        action: "view",
      }),
    }).catch(() => {});
  }, [shortLinkId, article?.id, viewRegistered]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsReady(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleContinue = useCallback(() => {
    setIsRedirecting(true);

    // Register the completed click
    fetch("/api/shortener/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shortLinkId,
        articleId: article?.id || null,
        action: "click",
      }),
    }).catch(() => {});

    // Small delay for visual feedback, then redirect
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 600);
  }, [shortLinkId, article?.id, targetUrl]);

  const progress = ((COUNTDOWN_SECONDS - timeLeft) / COUNTDOWN_SECONDS) * 100;

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 relative overflow-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full animate-float-orb"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full animate-float-orb"
          style={{
            background:
              "radial-gradient(circle, rgba(34, 211, 238, 0.06) 0%, transparent 70%)",
            animationDelay: "-4s",
          }}
        />
      </div>

      {/* Top navigation bar */}
      <header className="relative z-10 border-b border-white/[0.06] bg-[#0a0d14]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-white tracking-tight">
              LinkHub
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-emerald-400 font-medium">
              Verified & Secure
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Ad Slot: Top Banner */}
        <div className="mb-6 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-widest mb-2">
            <Eye className="w-3 h-3" />
            Advertisement
          </div>
          <div className="h-[90px] rounded-lg bg-gradient-to-r from-slate-800/40 to-slate-700/30 flex items-center justify-center border border-white/[0.04]">
            <span className="text-xs text-slate-500">
              Google AdSense Banner — 728×90
            </span>
          </div>
        </div>

        {/* Article content */}
        {article && (
          <article className="mb-8">
            {/* Article header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                  <BookOpen className="w-3 h-3" />
                  {article.readTime} min read
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
                {article.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                  <User className="w-3 h-3 text-indigo-300" />
                </div>
                <span>{article.author}</span>
              </div>
            </div>

            {/* Cover image */}
            {article.coverImage && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-white/[0.06]">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-48 sm:h-64 object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* Article body */}
            <div
              className="article-content prose prose-invert prose-sm max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
                prose-li:text-slate-300 prose-li:mb-1
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs
                prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                prose-ul:mb-4 prose-ol:mb-4"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        )}

        {/* Ad Slot: Mid-content */}
        <div className="mb-8 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-widest mb-2">
            <Eye className="w-3 h-3" />
            Advertisement
          </div>
          <div className="h-[250px] rounded-lg bg-gradient-to-br from-slate-800/40 to-slate-700/30 flex items-center justify-center border border-white/[0.04]">
            <span className="text-xs text-slate-500">
              Google AdSense — 300×250 Rectangle
            </span>
          </div>
        </div>

        {/* ═══════ GATEWAY CARD ═══════ */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle gradient accent at top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          <div className="text-center">
            {/* Link info */}
            {linkTitle && (
              <p className="text-sm text-slate-400 mb-1">Your download:</p>
            )}
            <h2 className="text-lg sm:text-xl font-bold text-white mb-6">
              {linkTitle || "Your link is almost ready"}
            </h2>

            {/* Timer / Ready state */}
            {!isReady ? (
              <div className="flex flex-col items-center gap-5 mb-6">
                {/* Circular progress */}
                <div className="relative w-24 h-24">
                  <svg
                    className="w-24 h-24 -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* Background track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="6"
                    />
                    {/* Progress arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#timerGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 42 * (1 - progress / 100)
                      }`}
                      style={{
                        transition: "stroke-dashoffset 1s linear",
                      }}
                    />
                    <defs>
                      <linearGradient
                        id="timerGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {timeLeft}
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">
                      seconds
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span>Please wait while your link is being prepared...</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 mb-6 animate-fade-in-up">
                {/* Success icon */}
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>

                <p className="text-sm text-emerald-400 font-medium">
                  ✓ Your link is ready!
                </p>
              </div>
            )}

            {/* Continue button */}
            <button
              onClick={handleContinue}
              disabled={!isReady || isRedirecting}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                isReady && !isRedirecting
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
                  : isRedirecting
                  ? "bg-indigo-600/50 text-white/80 cursor-wait"
                  : "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-white/[0.06]"
              }`}
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting...
                </>
              ) : isReady ? (
                <>
                  Continue to Download
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Please wait {timeLeft}s...
                </>
              )}
            </button>

            {/* Direct link hint */}
            {isReady && (
              <div className="mt-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <a
                  href={targetUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    handleContinue();
                  }}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Or open link directly
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Ad Slot: Bottom Banner */}
        <div className="mt-8 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-widest mb-2">
            <Eye className="w-3 h-3" />
            Advertisement
          </div>
          <div className="h-[90px] rounded-lg bg-gradient-to-r from-slate-800/40 to-slate-700/30 flex items-center justify-center border border-white/[0.04]">
            <span className="text-xs text-slate-500">
              Google AdSense Banner — 728×90
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] mt-12 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} LinkHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <a href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="/contact" className="hover:text-slate-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
