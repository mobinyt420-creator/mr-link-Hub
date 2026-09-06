"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Save,
  Check,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Lock,
  Flame,
  Globe,
  Palette,
} from "lucide-react";
import { DynamicIcon } from "@/lib/icons";

const ACCENT_COLORS = [
  { name: "Indigo", hex: "#6366f1" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Cyan / Blue", hex: "#06b6d4" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Amber / Gold", hex: "#f59e0b" },
  { name: "Rose", hex: "#f43f5e" },
];

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    brandName: "",
    username: "",
    bio: "",
    avatarUrl: "",
    accentColor: "#6366f1",
    footerText: "",
    announcementActive: true,
    announcementText: "",
    announcementUrl: "",
    announcementIcon: "Flame",
    seoTitle: "",
    seoDescription: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        const s = data.settings;
        setFormData((prev) => ({
          ...prev,
          brandName: s.brandName || "",
          username: s.username || "",
          bio: s.bio || "",
          avatarUrl: s.avatarUrl || "",
          accentColor: s.accentColor || "#6366f1",
          footerText: s.footerText || "",
          announcementActive: s.announcementActive,
          announcementText: s.announcementText || "",
          announcementUrl: s.announcementUrl || "",
          announcementIcon: s.announcementIcon || "Flame",
          seoTitle: s.seoTitle || "",
          seoDescription: s.seoDescription || "",
        }));
      }
    } catch {
      setError("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update settings.");
        setSaving(false);
        return;
      }

      setSuccessMessage("Settings saved successfully! Public site updated.");
      setTimeout(() => setSuccessMessage(""), 4000);
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch {
      setError("A network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 min-h-[50vh] flex items-center justify-center">
        Loading System Settings...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Platform & Brand Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global branding, visual accents, announcements, and admin credentials
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Profile Section */}
        <div className="p-5 sm:p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Profile & Brand Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Brand / Creator Name
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Username Handle
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Bio / Tagline
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Accent Color Palette */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Primary Accent Color
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {ACCENT_COLORS.map((c) => {
                const isSelected = formData.accentColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, accentColor: c.hex })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-slate-800 border-white text-white shadow-md"
                        : "bg-slate-950 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Announcement Banner */}
        <div className="p-5 sm:p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Global Announcement Banner
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, announcementActive: !formData.announcementActive })}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                formData.announcementActive
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {formData.announcementActive ? "Active" : "Disabled"}
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Announcement Message
              </label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Click-Through URL (Optional)
              </label>
              <input
                type="text"
                value={formData.announcementUrl}
                onChange={(e) => setFormData({ ...formData, announcementUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* SEO & Footer */}
        <div className="p-5 sm:p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Globe className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              SEO & Footer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Default Site SEO Title
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={formData.footerText}
                onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Default Meta Description
            </label>
            <input
              type="text"
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Admin Password Change */}
        <div className="p-5 sm:p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Lock className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Admin Password Security
            </h2>
          </div>

          <p className="text-xs text-slate-400">
            Leave blank if you do not wish to change the administrator password.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}