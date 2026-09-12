import React from "react";
import type { Metadata } from "next";
import { Users, Zap, Globe, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — LinkHub",
  description: "LinkHub is a premium link-in-bio and content gateway platform helping creators build their digital presence and monetize their audience.",
};

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-white mb-2">About LinkHub</h1>
      <p className="text-sm text-slate-400 mb-8">
        Building the future of creator-powered digital presence.
      </p>

      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Our Mission</h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          LinkHub is a next-generation link management and content gateway platform designed for
          content creators, digital entrepreneurs, gamers, and tech enthusiasts. We believe every
          creator deserves a beautiful, fast, and professional digital hub to showcase their work,
          connect with their audience, and grow their online presence.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          Founded in 2026, LinkHub combines cutting-edge web technology with stunning design
          aesthetics to deliver an experience that is faster, more beautiful, and more powerful
          than any traditional link-in-bio tool. Our platform is built with Next.js and modern
          web standards, ensuring lightning-fast performance and an exceptional user experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: Zap,
            title: "Lightning Fast",
            desc: "Built with Next.js for sub-second page loads and optimal performance worldwide.",
          },
          {
            icon: Globe,
            title: "Global Reach",
            desc: "Serve your audience worldwide with our globally distributed infrastructure.",
          },
          {
            icon: Users,
            title: "Creator First",
            desc: "Every feature is designed with content creators and digital entrepreneurs in mind.",
          },
          {
            icon: Heart,
            title: "Privacy Focused",
            desc: "We respect user privacy with transparent policies and minimal data collection.",
          },
        ].map((item) => (
          <div key={item.title} className="glass-card rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
              <item.icon className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white mb-4">Our Team</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          LinkHub is maintained by a passionate team of developers and designers who are
          committed to building the best creator platform in the world. We are constantly
          improving our platform based on user feedback and the latest web technologies.
        </p>
      </div>
    </div>
  );
}
