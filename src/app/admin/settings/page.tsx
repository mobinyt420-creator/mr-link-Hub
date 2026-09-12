"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Loader2,
  User,
  Palette,
  Megaphone,
  Globe,
  FileText,
  Check,
  AlertCircle,
} from "lucide-react";

interface SiteSettingsData {
  brandName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  accentColor: string;
  footerText: string;
  announcementActive: boolean;
  announcementText: string;
  announcementUrl: string;
  announcementIcon: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
}

const ACCENT_COLORS = [
  { value: "#6366f1", label: "Indigo" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#a855f7", label: "Purple" },
  { value: "#ec4899", label: "Pink" },
  { value: "#ef4444", label: "Red" },
  { value: "#f97316", label: "Orange" },
  { value: "#eab308", label: "Yellow" },
  { value: "#22c55e", label: "Green" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#3b82f6", label: "Blue" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data.settings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save.");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SiteSettingsData, value: string | boolean) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-slate-400" />
            Site Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">Configure your brand, appearance, and SEO</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold hover:from-indigo-500 hover:to-indigo-400 transition-all active:scale-[0.97] disabled:opacity-50 shadow-lg shadow-indigo-600/20"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Section */}
      <section className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Profile & Brand</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Brand Name</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => updateField("brandName", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={settings.username}
                onChange={(e) => updateField("username", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Bio</label>
            <textarea
              value={settings.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Avatar URL</label>
            <input
              type="text"
              value={settings.avatarUrl}
              onChange={(e) => updateField("avatarUrl", e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-white">Appearance</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Accent Color</label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateField("accentColor", color.value)}
                  className={`w-10 h-10 rounded-xl border-2 transition-all hover:scale-105 ${
                    settings.accentColor === color.value
                      ? "border-white ring-2 ring-white/20 scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Footer Text</label>
            <input
              type="text"
              value={settings.footerText}
              onChange={(e) => updateField("footerText", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Announcement Section */}
      <section className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white">Announcement Bar</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Show Announcement</span>
            <button
              onClick={() => updateField("announcementActive", !settings.announcementActive)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                settings.announcementActive ? "bg-indigo-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings.announcementActive ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          {settings.announcementActive && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Text</label>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) => updateField("announcementText", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Link URL</label>
                  <input
                    type="text"
                    value={settings.announcementUrl}
                    onChange={(e) => updateField("announcementUrl", e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Icon</label>
                  <input
                    type="text"
                    value={settings.announcementIcon}
                    onChange={(e) => updateField("announcementIcon", e.target.value)}
                    placeholder="Flame"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* SEO Section */}
      <section className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white">SEO & Open Graph</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">SEO Title</label>
            <input
              type="text"
              value={settings.seoTitle}
              onChange={(e) => updateField("seoTitle", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">SEO Description</label>
            <textarea
              value={settings.seoDescription}
              onChange={(e) => updateField("seoDescription", e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">OG Image URL</label>
            <input
              type="text"
              value={settings.ogImage}
              onChange={(e) => updateField("ogImage", e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
