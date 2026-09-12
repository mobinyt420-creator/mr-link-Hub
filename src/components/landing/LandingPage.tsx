"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  ArrowRight,
  Shield,
  Sparkles,
  Smartphone,
  DollarSign,
  BarChart3,
  QrCode,
  Flame,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Share2,
  Lock,
  Globe,
  Star,
  Users,
  Layers,
  Check,
  TrendingUp,
  Diamond,
  Server,
  Download,
  Send,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import PublicFooter from "@/components/public/PublicFooter";

export default function LandingPage() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();
  const [claimHandle, setClaimHandle] = useState("");
  const [activeTab, setActiveTab] = useState<"gamer" | "influencer" | "business">("gamer");

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimHandle.trim()) return;
    if (user) {
      router.push("/admin");
    } else {
      openAuthModal();
    }
  };

  // Mock phone preview presets
  const PREVIEW_DATA = {
    gamer: {
      name: "Mobin X (Gamer)",
      handle: "@mobinx",
      bio: "🔥 Free Fire Top-Up Partner • Live Streamer • 100K+ Community",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      accent: "#6366f1",
      links: [
        { title: "💎 Free Fire Instant Diamond Top-Up", icon: Diamond, badge: "INSTANT", color: "bg-indigo-600" },
        { title: "⚡ VIP Proxy Server Fast Nodes", icon: Server, badge: "FAST", color: "bg-purple-600" },
        { title: "📥 Download VIP Gaming Config", icon: Download, badge: "FREE", color: "bg-emerald-600" },
        { title: "📢 Join 50K+ Telegram Group", icon: Send, badge: "HOT", color: "bg-sky-600" },
      ],
    },
    influencer: {
      name: "Tanzim Vibes",
      handle: "@tanzim",
      bio: "✨ Lifestyle, Fashion & Tech Influencer • Collabs: tanzim@brand.com",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
      accent: "#ec4899",
      links: [
        { title: "💄 My Daily Makeup & Skincare Picks", icon: Star, badge: "30% OFF", color: "bg-pink-600" },
        { title: "📸 Latest YouTube Vlog: Behind The Scenes", icon: Sparkles, badge: "NEW", color: "bg-rose-600" },
        { title: "🛍️ Exclusive Daraz Affiliate Discount Codes", icon: DollarSign, badge: "SAVE", color: "bg-amber-600" },
        { title: "💌 Collab & Brand Partnership Form", icon: Globe, badge: "CONTACT", color: "bg-violet-600" },
      ],
    },
    business: {
      name: "Gadget BD Official",
      handle: "@gadgetbd",
      bio: "📱 Premium Mobile & Smart Gadgets • Same Day Delivery in BD",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
      accent: "#06b6d4",
      links: [
        { title: "🛒 Shop Wireless Earbuds & Smartwatches", icon: Globe, badge: "BESTSELLER", color: "bg-cyan-600" },
        { title: "💬 WhatsApp 1-Click Fast Order", icon: Smartphone, badge: "24/7 SUPPORT", color: "bg-emerald-600" },
        { title: "🔥 Flash Sale 40% Off Mega Deals", icon: Flame, badge: "LIMITED", color: "bg-orange-600" },
        { title: "📍 Showroom Address & Google Map", icon: ExternalLink, badge: "VISIT", color: "bg-blue-600" },
      ],
    },
  };

  const currentPreview = PREVIEW_DATA[activeTab];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Next-Gen Link-in-Bio & SafeLink Platform</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                আপনার সব লিঙ্ক এক জায়গায়,{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                  প্রতি ক্লিকে নিশ্চিত আয়!
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                ক্রিয়েটর, গেমার ও অনলাইন উদ্যোক্তাদের জন্য অল-ইন-ওয়ান লিঙ্ক ম্যানেজমেন্ট ও মনিটাইজেশন প্ল্যাটফর্ম। শর্টলিঙ্ক তৈরি করুন এবং বিকাশ ও নগদে উইথড্র নিন।
              </p>

              {/* Claim Username Input Box */}
              <form
                onSubmit={handleClaim}
                className="w-full max-w-md mx-auto lg:mx-0 p-1.5 rounded-2xl bg-[#0d1222]/90 border border-white/10 shadow-2xl flex flex-col sm:flex-row gap-2"
              >
                <div className="flex items-center px-3.5 py-2.5 flex-1">
                  <span className="text-xs sm:text-sm font-bold text-indigo-400">linkhub.app/</span>
                  <input
                    type="text"
                    value={claimHandle}
                    onChange={(e) => setClaimHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    placeholder="yourname"
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none pl-1 font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
                >
                  <span>Claim Your Page</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-400">
                <div className="flex -space-x-2">
                  <img className="w-7 h-7 rounded-full border-2 border-[#07090e]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Creator" />
                  <img className="w-7 h-7 rounded-full border-2 border-[#07090e]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Creator" />
                  <img className="w-7 h-7 rounded-full border-2 border-[#07090e]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Creator" />
                </div>
                <span>১,৫০০+ ক্রিয়েটর ইতিমধ্যে যুক্ত হয়েছেন</span>
              </div>

            </div>

            {/* Hero Right: Live Interactive Phone Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              {/* Preset Switcher Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-4 backdrop-blur-md">
                <button
                  onClick={() => setActiveTab("gamer")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "gamer"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🎮 Gamer
                </button>
                <button
                  onClick={() => setActiveTab("influencer")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "influencer"
                      ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ✨ Influencer
                </button>
                <button
                  onClick={() => setActiveTab("business")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "business"
                      ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🛍️ Brand & Shop
                </button>
              </div>

              {/* Realistic Phone Frame */}
              <div className="w-[300px] sm:w-[330px] rounded-[40px] border-4 border-slate-700/60 bg-[#0a0d16] p-4 shadow-2xl shadow-indigo-950/60 relative overflow-hidden backdrop-blur-2xl">
                {/* Phone Notch */}
                <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                </div>

                {/* Profile Header */}
                <div className="text-center space-y-2 mb-4">
                  <div className="relative inline-block">
                    <img
                      src={currentPreview.avatar}
                      alt={currentPreview.name}
                      className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-indigo-400/40 shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a0d16]" />
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {currentPreview.name}
                  </h3>
                  <span className="text-[10px] font-mono text-indigo-300 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    {currentPreview.handle}
                  </span>
                  <p className="text-[11px] text-slate-300 leading-snug px-2">
                    {currentPreview.bio}
                  </p>
                </div>

                {/* Links Stack */}
                <div className="space-y-2">
                  {currentPreview.links.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="group p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-between transition-all cursor-pointer hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-semibold text-white truncate">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-indigo-200 uppercase flex-shrink-0">
                          {item.badge}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Powered by LinkHub */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
                  <span className="text-[10px] text-slate-400 font-semibold">
                    ⚡ Powered by <span className="text-indigo-400 font-bold">LinkHub</span>
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 sm:py-24 border-t border-white/[0.06] bg-[#090c14] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
              All-in-One Platform
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              কেন হাজারো ক্রিয়েটর LinkHub বেছে নিচ্ছেন?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">আল্ট্রা-ফাস্ট বায়ো পেইজ</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                মিলিসেকেন্ড স্পিড, কাটিং-এজ গ্লাস ডিজাইন ও ডার্ক নিয়ন থিম। মোবাইল ব্রাউজারে নিমিষেই লোড হয়।
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">SafeLink শর্টনার আয়</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                যে কোনো ডাউনলোড বা এক্সটার্নাল লিঙ্ককে সেফলিঙ্ক বানান। টাইমার ও হাই-সিপিএম অ্যাড দেখে ভিজিটর কন্টেন্টে যাবে।
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-pink-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">বিকাশ ও নগদ পেআউট</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                আন্তর্জাতিক পেপাল বা মাস্টারকার্ডের ঝামেলা নেই। প্রতি সপ্তাহের উপার্জন সরাসরি আপনার বিকাশ বা নগদে নিন।
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">রিয়েল-টাইম এনালিটিক্স</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                কোন লিঙ্কে কত ক্লিক পড়ছে, কোন দেশ ও ডিভাইস থেকে ট্রাফিক আসছে সব লাইভ চার্টে দেখতে পারবেন।
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ডায়নামিক QR Code</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                প্রতিটি বায়ো লিঙ্ক ও অফারের জন্য ১-ক্লিকে হাই-রেজুলেশন কিউআর কোড জেনারেট করুন ও ডাউনলোড করুন।
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Firebase & SSL সিকিউরিটি</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                গুগল ক্লাউড ফায়ারবেস ব্যাকেন্ড ও এনক্রিপ্টেড ডাটাবেজ। আপনার প্রোফাইল ও উপার্জনের ১০০% নিরাপত্তা।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 sm:py-24 border-t border-white/[0.06] bg-[#07090e]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
              Simple & Transparent Pricing
            </h2>
            <p className="text-3xl font-extrabold text-white">
              সবার জন্য ফ্রি, প্রফেশনালদের জন্য Pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Starter</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">৳০</span>
                  <span className="text-xs text-slate-400">/ আজীবনের জন্য</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">নতুন ক্রিয়েটর ও বিগিনারদের জন্য পারফেক্ট।</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> ১টি কাস্টম বায়ো প্রোফাইল
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> আনলিমিটেড সোশ্যাল লিঙ্ক
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> SafeLink শর্টনার ও অ্যাড মনিটাইজেশন
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> বিকাশ ও নগদ উইথড্রয়াল
                  </li>
                </ul>
              </div>

              <button
                onClick={openAuthModal}
                className="mt-8 w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all"
              >
                ফ্রি শুরু করুন
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-950/40 to-[#0e1324] border-2 border-indigo-500/40 relative shadow-2xl shadow-indigo-950/50 flex flex-col justify-between">
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-md">
                MOST POPULAR
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Pro Creator</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">৳২৯৯</span>
                  <span className="text-xs text-slate-400">/ প্রতি মাস</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">প্রফেশনাল ইনফ্লুয়েন্সার ও ব্যবসায়ীদের জন্য।</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2 font-semibold">
                    <Check className="w-4 h-4 text-indigo-400" /> কোনো LinkHub ব্র্যান্ডিং নেই (No Branding)
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <Check className="w-4 h-4 text-indigo-400" /> কাস্টম ডোমেইন সাপোর্ট (yourbrand.com)
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <Check className="w-4 h-4 text-indigo-400" /> সর্বোচ্চ SafeLink CPM ও বোনাস
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <Check className="w-4 h-4 text-indigo-400" /> প্রায়োরিটি ২৪/৭ হোয়াটসঅ্যাপ সাপোর্ট
                  </li>
                </ul>
              </div>

              <button
                onClick={openAuthModal}
                className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all"
              >
                Pro প্ল্যানে আপগ্রেড করুন
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 border-t border-white/[0.06] bg-gradient-to-b from-[#0a0d16] to-[#07090e] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            আজই আপনার লিঙ্ক হাব তৈরি করুন
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8">
            কোনো জটিলতা ছাড়াই মাত্র ১-ক্লিকে গুগল সাইন-ইন করে আপনার লিঙ্ক ও আয় ম্যানেজ করুন।
          </p>
          <button
            onClick={openAuthModal}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4" />
            <span>Get Started with Google (Free)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <PublicFooter
        footerText={`© ${new Date().getFullYear()} LinkHub. All rights reserved.`}
        brandName="LinkHub"
      />
    </div>
  );
}
