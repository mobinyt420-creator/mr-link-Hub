"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  ChevronDown,
  Play,
  Volume2,
  VolumeX,
  Lock,
  Sparkles,
  CheckCircle2,
  ArrowDownCircle,
  FileCheck,
  ShieldCheck,
  Download,
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

const STEP_1_COUNTDOWN = 10;
const STEP_2_COUNTDOWN = 5;

export default function GatewayClient({
  shortCode,
  shortLinkId,
  targetUrl,
  linkTitle,
  article,
}: GatewayClientProps) {
  // Step state (1 or 2)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Step 1 Timer (10s)
  const [timeLeft1, setTimeLeft1] = useState(STEP_1_COUNTDOWN);
  const [isStep1Ready, setIsStep1Ready] = useState(false);

  // Step 2 Timer (5s)
  const [timeLeft2, setTimeLeft2] = useState(STEP_2_COUNTDOWN);
  const [isStep2Ready, setIsStep2Ready] = useState(false);

  // Redirect state
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [viewRegistered, setViewRegistered] = useState(false);

  // Video Ad player state
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);

  // Ref for auto scroll
  const bottomActionRef = useRef<HTMLDivElement>(null);

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

  // Step 1 Countdown Timer (10 seconds)
  useEffect(() => {
    if (currentStep !== 1) return;

    if (timeLeft1 <= 0) {
      setIsStep1Ready(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft1((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft1, currentStep]);

  // Step 2 Countdown Timer (5 seconds)
  useEffect(() => {
    if (currentStep !== 2) return;

    if (timeLeft2 <= 0) {
      setIsStep2Ready(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft2((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft2, currentStep]);

  // Video Ad simulation progress in Step 2
  useEffect(() => {
    if (currentStep !== 2 || !isVideoPlaying) return;

    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 20; // 5 steps for 5 seconds
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, isVideoPlaying]);

  // Transition from Step 1 to Step 2
  const goToStep2 = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Final destination redirect
  const handleFinalRedirect = useCallback(() => {
    setIsRedirecting(true);

    // Register the completed click in the backend
    fetch("/api/shortener/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shortLinkId,
        articleId: article?.id || null,
        action: "click",
      }),
    }).catch(() => {});

    // Redirect after brief visual confirmation
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 650);
  }, [shortLinkId, article?.id, targetUrl]);

  // Scroll to bottom action helper
  const scrollToUnlock = () => {
    if (bottomActionRef.current) {
      bottomActionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Step 1 percentage
  const progressStep1 =
    ((STEP_1_COUNTDOWN - timeLeft1) / STEP_1_COUNTDOWN) * 100;
  // Step 2 percentage
  const progressStep2 =
    ((STEP_2_COUNTDOWN - timeLeft2) / STEP_2_COUNTDOWN) * 100;

  // Extract host domain name for preview
  let targetDomain = "Download Server";
  try {
    const parsed = new URL(targetUrl);
    targetDomain = parsed.hostname.replace("www.", "");
  } catch {}

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 relative overflow-hidden flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[-20%] left-[-10%] w-[650px] h-[650px] rounded-full animate-float-orb"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.09) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[550px] h-[550px] rounded-full animate-float-orb"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)",
            animationDelay: "-4s",
          }}
        />
      </div>

      {/* ═══════ TOP NAVIGATION & PROGRESS HEADER ═══════ */}
      <header className="relative z-20 border-b border-white/[0.06] bg-[#0a0d14]/90 backdrop-blur-xl sticky top-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm text-white tracking-tight block leading-none">
                LinkHub SafeLink
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Code: {shortCode}
              </span>
            </div>
          </div>

          {/* 2-Step Progress Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  currentStep === 1
                    ? "bg-indigo-400 animate-ping"
                    : "bg-emerald-400"
                }`}
              />
              <span className="font-medium text-slate-300">
                {currentStep === 1 ? "ধাপ ১/২ (Step 1)" : "ধাপ ২/২ (Step 2)"}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>নিরাপদ লিঙ্ক</span>
            </div>
          </div>
        </div>

        {/* Global Step Progress Indicator Bar */}
        <div className="w-full bg-slate-900 h-1 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 ease-out"
            style={{
              width: currentStep === 1 ? `${Math.min(50, (progressStep1 / 2))}%` : `${50 + (progressStep2 / 2)}%`,
            }}
          />
        </div>
      </header>

      {/* ═══════ MAIN WRAPPER ═══════ */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* ═══════════════════════════════════════════════════
            STEP 1: 10s Countdown + Scroll Prompt + Article + Ads
           ═══════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="animate-fade-in-up">
            {/* Top Display Image Ad */}
            <div className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 text-center relative overflow-hidden">
              <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest px-1 mb-2">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-indigo-400" />
                  Sponsored Advertisement
                </span>
                <span className="text-slate-600 font-mono">Google AdSense Display 728×90</span>
              </div>
              <div className="h-[90px] rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 flex flex-col items-center justify-center border border-indigo-500/10 p-3">
                <p className="text-xs font-semibold text-indigo-300">
                  ⚡ High-Speed Cloud VPS & Proxy Network — 50% Off Today
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ultra-low latency, unlimited bandwidth & 24/7 technical support.
                </p>
              </div>
            </div>

            {/* Step 1 Timer Status Box */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 mb-6 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 to-purple-950/10 shadow-xl shadow-indigo-950/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Circular Timer Progress */}
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="5"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="url(#step1Gradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 34}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 34 * (1 - progressStep1 / 100)
                        }`}
                        style={{ transition: "stroke-dashoffset 1s linear" }}
                      />
                      <defs>
                        <linearGradient id="step1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-white tabular-nums leading-none">
                        {timeLeft1}
                      </span>
                      <span className="text-[8px] text-slate-400 uppercase">সেকেন্ড</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      {isStep1Ready ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                          <span className="text-emerald-300">লিঙ্ক প্রস্তুত হয়েছে!</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-indigo-400 animate-spin" />
                          <span>নিরাপদ লিঙ্ক তৈরি হচ্ছে...</span>
                        </>
                      )}
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      {isStep1Ready
                        ? "নিচের দিকে স্ক্রল করে আর্টিকেলটি পড়ুন এবং ধাপ ২ বাটনে ক্লিক করুন।"
                        : `অনুগ্রহ করে ${timeLeft1} সেকেন্ড অপেক্ষা করুন। নিচে আর্টিকেলটি পড়ুন।`}
                    </p>
                  </div>
                </div>

                {/* Quick Scroll Down Guide Button */}
                <button
                  onClick={scrollToUnlock}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-200 transition-all hover:scale-105"
                >
                  <ChevronDown className="w-4 h-4 text-indigo-400 animate-bounce" />
                  <span>নিচে যান (Scroll Down)</span>
                </button>
              </div>

              {/* Pulsing Scroll Notice Banner */}
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-indigo-300 bg-indigo-500/[0.04] px-3 py-2 rounded-lg">
                <span className="flex items-center gap-1.5">
                  <ArrowDownCircle className="w-4 h-4 text-indigo-400 animate-bounce" />
                  <strong>নির্দেশনা:</strong> নিচে স্ক্রল করে সম্পূর্ণ আর্টিকেলটি দেখুন এবং পরবর্তী ধাপে যাওয়ার বাটন আনলক করুন।
                </span>
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">ধাপ ১ / ২</span>
              </div>
            </div>

            {/* Article Content Display */}
            {article && (
              <article className="mb-8 glass-card rounded-2xl p-6 sm:p-8 border border-white/[0.06]">
                {/* Article Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <BookOpen className="w-3.5 h-3.5" />
                      {article.readTime} মিনিট পড়ার সময়
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
                    {article.title}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-indigo-300" />
                    </div>
                    <span>{article.author}</span>
                  </div>
                </div>

                {/* Cover image */}
                {article.coverImage && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-white/[0.08] shadow-lg">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-52 sm:h-72 object-cover"
                      loading="eager"
                    />
                  </div>
                )}

                {/* Article Body */}
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

                {/* Mid-Article Responsive Image Ad */}
                <div className="my-8 rounded-xl border border-dashed border-indigo-500/20 bg-indigo-950/10 p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-widest mb-2">
                    <Eye className="w-3 h-3 text-indigo-400" />
                    Google AdSense Responsive Rectangle — 300×250
                  </div>
                  <div className="h-[120px] rounded-lg bg-slate-900/60 flex flex-col items-center justify-center border border-white/[0.04] p-4">
                    <span className="text-sm font-semibold text-purple-300">
                      🎯 Gaming Top-Up & Diamond Store — 100% Instant Delivery
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Support for bKash, Nagad & Rocket with instant bonus code.
                    </span>
                  </div>
                </div>
              </article>
            )}

            {/* ═══════ STEP 1 BOTTOM ACTION AREA ═══════ */}
            <div
              ref={bottomActionRef}
              id="step1-action"
              className="glass-card rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden border border-indigo-500/20 bg-gradient-to-b from-indigo-950/30 to-[#0a0d14]"
            >
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-bold text-white mb-2">
                  {linkTitle || "আপনার কাঙ্ক্ষিত ফাইল"}
                </h3>
                <p className="text-xs text-slate-400 mb-6 flex items-center justify-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-indigo-400" />
                  ডেস্টিনেশন সার্ভার: <span className="text-indigo-300 font-mono font-semibold">{targetDomain}</span>
                </p>

                {/* Step 1 Button State */}
                <button
                  onClick={goToStep2}
                  disabled={!isStep1Ready}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl ${
                    isStep1Ready
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] animate-pulse"
                      : "bg-slate-800/60 text-slate-500 cursor-not-allowed border border-white/[0.06]"
                  }`}
                >
                  {isStep1Ready ? (
                    <>
                      <span>পরবর্তী ধাপে যান (Continue to Step 2)</span>
                      <ArrowRight className="w-5 h-5 animate-bounce-x" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-slate-500" />
                      <span>অনুগ্রহ করে অপেক্ষা করুন ({timeLeft1} সেকেন্ড)...</span>
                    </>
                  )}
                </button>

                {!isStep1Ready && (
                  <p className="text-[11px] text-slate-500 mt-3">
                    🔒 টাইমার শেষ হওয়া মাত্রই বাটনটি স্বয়ংক্রিয়ভাবে সক্রিয় হবে।
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            STEP 2: 5s Verification + Video Ad + Final Download
           ═══════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="animate-fade-in-up">
            {/* Step 2 Progress Header */}
            <div className="mb-6 glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-950/10 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                চূড়ান্ত ধাপ (Final Step 2 of 2)
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                ফাইল সিকিউরিটি ভেরিফিকেশন চলছে...
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                আর মাত্র ৫ সেকেন্ডেই আপনার মূল ডাউনলোড লিঙ্ক আনলক হবে।
              </p>
            </div>

            {/* 🎥 Interactive Video Ad Showcase */}
            <div className="mb-6 rounded-2xl border border-white/[0.08] bg-slate-900/80 p-4 sm:p-5 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] tracking-wider uppercase">
                    Sponsored Video Ad
                  </span>
                  <span className="text-slate-400 text-xs">Cloud CDN Solution</span>
                </div>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Video Simulation Box */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border border-white/[0.06] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/20">
                  <Play className="w-6 h-6 text-indigo-300 fill-indigo-300" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  Ultra-Fast Global VPN & Gaming Accelerator
                </h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Ping 15ms guaranteed • Zero Packet Loss • Bangladesh Server Available
                </p>

                {/* Video Playback Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/[0.1]">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 5-Second Rapid Countdown & Security Badges */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 border border-indigo-500/20 bg-gradient-to-b from-indigo-950/20 to-slate-900/60">
              <div className="flex flex-col items-center text-center">
                {/* 5s Countdown Ring */}
                {!isStep2Ready ? (
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="6"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="url(#step2Gradient)"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          strokeDashoffset={`${
                            2 * Math.PI * 42 * (1 - progressStep2 / 100)
                          }`}
                          style={{ transition: "stroke-dashoffset 1s linear" }}
                        />
                        <defs>
                          <linearGradient id="step2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white tabular-nums">
                          {timeLeft2}
                        </span>
                        <span className="text-[9px] text-slate-400 uppercase">সেকেন্ড</span>
                      </div>
                    </div>
                    <p className="text-xs text-indigo-300 font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4 animate-spin" />
                      ফাইলটি প্রস্তুত করা হচ্ছে ({timeLeft2} সেকেন্ড)...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 mb-6 animate-fade-in-up">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-400">
                      ✓ আপনার ডাউনলোড লিঙ্ক প্রস্তুত!
                    </h3>
                  </div>
                )}

                {/* Security Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-6">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-semibold text-slate-200">SSL 256-Bit</div>
                      <div className="text-[10px] text-slate-500">এনক্রিপ্টেড ট্রান্সফার</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-semibold text-slate-200">High-Speed CDN</div>
                      <div className="text-[10px] text-slate-500">সর্বোচ্চ ডাউনলোড স্পিড</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-semibold text-slate-200">Virus Scan: Clean</div>
                      <div className="text-[10px] text-slate-500">১০০% সুরক্ষিত ফাইল</div>
                    </div>
                  </div>
                </div>

                {/* FINAL DOWNLOAD BUTTON */}
                <button
                  onClick={handleFinalRedirect}
                  disabled={!isStep2Ready || isRedirecting}
                  className={`w-full py-4 px-8 rounded-xl font-extrabold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl ${
                    isStep2Ready && !isRedirecting
                      ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] animate-pulse"
                      : isRedirecting
                      ? "bg-indigo-600/50 text-white/80 cursor-wait"
                      : "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-white/[0.06]"
                  }`}
                >
                  {isRedirecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>রিডাইরেক্ট করা হচ্ছে...</span>
                    </>
                  ) : isStep2Ready ? (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Get Link / ফাইলটি ডাউনলোড করুন 🚀</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>লিঙ্ক যাচাই হচ্ছে ({timeLeft2} সেকেন্ড)...</span>
                    </>
                  )}
                </button>

                {/* Back to Step 1 link */}
                <button
                  onClick={() => setCurrentStep(1)}
                  className="mt-4 text-xs text-slate-500 hover:text-slate-400 transition-colors"
                >
                  ← ধাপ ১-এ ফিরে যান
                </button>
              </div>
            </div>

            {/* Bottom Ad Banner */}
            <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                <Eye className="w-3 h-3 text-indigo-400" />
                Google AdSense Footer Banner
              </div>
              <p className="text-xs text-slate-400">
                Secure link verification powered by LinkHub SafeLink Gateway
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative z-10 border-t border-white/[0.04] mt-12 py-6 bg-[#07090e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} LinkHub SafeLink. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <a href="/privacy" className="hover:text-slate-300 transition-colors">গোপনীয়তা নীতি</a>
            <a href="/terms" className="hover:text-slate-300 transition-colors">শর্তাবলী</a>
            <a href="/contact" className="hover:text-slate-300 transition-colors">যোগাযোগ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
