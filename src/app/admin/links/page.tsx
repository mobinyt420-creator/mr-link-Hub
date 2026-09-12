"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Link2,
  Plus,
  Search,
  Edit3,
  Trash2,
  Loader2,
  X,
  Check,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from "lucide-react";
import { DynamicIcon, AVAILABLE_ICONS } from "@/lib/icons";

interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  type: string;
  category: string;
  badge: string;
  isActive: boolean;
  order: number;
  clickCount: number;
  _count?: { pageComponents: number };
}

const LINK_TYPES = ["standard", "featured", "social", "download", "video"];
const CATEGORIES = ["Service", "Social", "Download", "Video", "Utility", "Gaming", "Commerce"];

export default function AdminLinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    url: "",
    icon: "ExternalLink",
    type: "standard",
    category: "Service",
    badge: "",
    isActive: true,
  });

  const fetchLinks = useCallback(() => {
    fetch("/api/admin/links")
      .then((res) => res.json())
      .then((data) => {
        setLinks(data.links || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const openCreateModal = () => {
    setEditingLink(null);
    setForm({
      title: "",
      description: "",
      url: "",
      icon: "ExternalLink",
      type: "standard",
      category: "Service",
      badge: "",
      isActive: true,
    });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (link: LinkItem) => {
    setEditingLink(link);
    setForm({
      title: link.title,
      description: link.description,
      url: link.url,
      icon: link.icon,
      type: link.type,
      category: link.category,
      badge: link.badge,
      isActive: link.isActive,
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.url) {
      setError("Title and URL are required.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const url = editingLink
        ? `/api/admin/links/${editingLink.id}`
        : "/api/admin/links";
      const method = editingLink ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save.");
        return;
      }

      setShowModal(false);
      fetchLinks();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    setDeleting(id);

    try {
      await fetch(`/api/admin/links/${id}`, { method: "DELETE" });
      fetchLinks();
    } catch {
      // Ignore
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (link: LinkItem) => {
    await fetch(`/api/admin/links/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !link.isActive }),
    });
    fetchLinks();
  };

  const filteredLinks = links.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Link2 className="w-6 h-6 text-indigo-400" />
            Links
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage all your links — {links.length} total</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold hover:from-indigo-500 hover:to-indigo-400 transition-all active:scale-[0.97] shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors"
        />
      </div>

      {/* Links list */}
      <div className="space-y-2">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            {searchQuery ? "No links found matching your search." : "No links yet. Create your first link!"}
          </div>
        ) : (
          filteredLinks.map((link) => (
            <div
              key={link.id}
              className={`flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border transition-all hover:bg-white/[0.04] ${
                link.isActive ? "border-white/[0.06]" : "border-red-500/15 opacity-60"
              }`}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                <DynamicIcon name={link.icon} className="w-5 h-5 text-slate-300" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white truncate">{link.title}</span>
                  {link.badge && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 flex-shrink-0">
                      {link.badge}
                    </span>
                  )}
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 flex-shrink-0">
                    {link.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{link.url}</p>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400 flex-shrink-0">
                <span className="font-mono">{link.clickCount} clicks</span>
                <span>{link._count?.pageComponents || 0} pages</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => toggleActive(link)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    link.isActive ? "text-emerald-400 hover:bg-emerald-500/10" : "text-slate-500 hover:bg-slate-500/10"
                  }`}
                  title={link.isActive ? "Disable" : "Enable"}
                >
                  {link.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => openEditModal(link)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  disabled={deleting === link.id}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  {deleting === link.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0d1117] border border-white/[0.08] rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingLink ? "Edit Link" : "Add New Link"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Free Fire Top Up"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">URL *</label>
                <input
                  type="text"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                  >
                    {LINK_TYPES.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Badge</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="e.g. HOT, NEW, FAST"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Icon</label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.name} value={ic.name}>{ic.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Popular Brand Icons — Quick Pick Grid */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Quick Pick — Brand Icons</label>
                <div className="flex flex-wrap gap-2">
                  {["Telegram", "Youtube", "WhatsApp", "Facebook", "TikTok", "Instagram", "Diamond", "Download", "Server", "Globe", "Gamepad2", "Star"].map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setForm({ ...form, icon: iconName })}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all border ${
                        form.icon === iconName
                          ? "bg-indigo-500/20 border-indigo-500/40 ring-2 ring-indigo-500/30 scale-105"
                          : "bg-slate-800/40 border-white/[0.08] hover:border-indigo-500/30 hover:bg-slate-700/40"
                      }`}
                      title={iconName}
                    >
                      <DynamicIcon name={iconName} className="w-6 h-6" size={24} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Logo URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Custom Logo URL (Optional)</label>
                <input
                  type="text"
                  value={(form as any).customIconUrl || ""}
                  onChange={(e) => setForm({ ...form, customIconUrl: e.target.value } as any)}
                  placeholder="https://example.com/logo.png — paste external logo URL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
                <p className="text-[10px] text-slate-500">Leave empty to use the selected icon above. Paste a URL to use a custom logo image instead.</p>
              </div>

              {/* Icon Preview */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-white/[0.08] flex items-center justify-center overflow-hidden">
                  {(form as any).customIconUrl ? (
                    <img src={(form as any).customIconUrl} alt="Custom" className="w-7 h-7 object-contain" />
                  ) : (
                    <DynamicIcon name={form.icon} className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-400">Icon Preview</p>
                  <p className="text-sm text-white font-medium">{(form as any).customIconUrl ? "Custom Logo" : form.icon}</p>
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold hover:from-indigo-500 hover:to-indigo-400 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingLink ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
