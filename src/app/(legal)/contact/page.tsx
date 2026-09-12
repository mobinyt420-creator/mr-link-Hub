import React from "react";
import type { Metadata } from "next";
import { Mail, MessageSquare, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — LinkHub",
  description: "Get in touch with the LinkHub team. We're here to help with any questions, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-white mb-2">Contact Us</h1>
      <p className="text-sm text-slate-400 mb-8">
        Have a question or feedback? We&apos;d love to hear from you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: Mail,
            title: "Email",
            value: "support@linkhub.me",
            desc: "For general inquiries and support",
          },
          {
            icon: MessageSquare,
            title: "Telegram",
            value: "@linkhub_support",
            desc: "For quick responses and community chat",
          },
          {
            icon: MapPin,
            title: "Location",
            value: "Dhaka, Bangladesh",
            desc: "Our headquarters",
          },
          {
            icon: Clock,
            title: "Response Time",
            value: "Within 24 hours",
            desc: "We respond as quickly as possible",
          },
        ].map((item) => (
          <div key={item.title} className="glass-card rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
              <item.icon className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-0.5">{item.title}</h3>
            <p className="text-sm text-indigo-300 font-medium mb-1">{item.value}</p>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Contact form */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white mb-5">Send us a Message</h2>
        <form className="space-y-4" action="#">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Subject</label>
            <input
              type="text"
              placeholder="What's this about?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Message</label>
            <textarea
              rows={5}
              placeholder="Write your message here..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
