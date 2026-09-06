"use client";

import React, { useEffect, useState } from "react";
import {
  Link2,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Info,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { DynamicIcon } from "@/lib/icons";
import IconPicker from "@/components/admin/IconPicker";

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

export default function AdminLinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    icon: "ExternalLink",
    type: "standard",
    category: "Service",
    badge: "",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const categories = ["All", "Service", "Social", "Download", "Video", "Utility"];

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingLink(null);
    setFormData({
      title: "",
      url: "",
      description: "",
      icon: "ExternalLink",
      type: "standard",
      category: "Service",
      badge: "",
      isActive: true,
    });
    setError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (link: LinkItem) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description,
      icon: link.icon,
      type: link.type,
      category: link.category,
      badge: link.badge,
      isActive: link.isActive,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) {
      setError("Title and URL are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const endpoint = editingLink ? `/api/links/${editingLink.id}` : "/api/links";
      const method = editingLink ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save link.");
        setSubmitting(false);
        return;
      }

      setSuccessMessage(
        editingLink
          ? `Updated "${formData.title}". All connected pages updated automatically!`
          : `Created "${formData.title}" in library.`
      );
      setTimeout(() => setSuccessMessage(""), 4000);

      setModalOpen(false);
      fetchLinks();
    } catch {
      setError("A network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (link: LinkItem) => {
    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !link.isActive }),
      });
      if (res.ok) {
        fetchLinks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (link: LinkItem) => {
    const pageCount = link._count?.pageComponents || 0;
    const confirmMsg =
      pageCount > 0
        ? `"${link.title}" is currently used on ${pageCount} page(s). Deleting it will remove it from those pages. Are you sure?`
        : `Are you sure you want to delete "${link.title}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/links/${link.id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccessMessage(`Deleted "${link.title}".`);
        setTimeout(() => setSuccessMessage(""), 4000);
        fetchLinks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter links
  const filteredLinks = links.filter((link) => {
    const matchesCategory = selectedCategory === "All" || link.category === selectedCategory;
    const matchesSearch =
      link.title.toLowerCase().includes(search.toLowerCase()) ||
      link.url.toLowerCase().includes(search.toLowerCase()) ||
      link.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Reusable Link Library
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Central single source of truth for destinations across your Main Site and Extra Pages
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Link</span>
        </button>
      </div>

      {/* Central Source of Truth Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-white">Central Source Principle: </strong>
          Whenever you change a URL, title, or icon in this library (e.g. your Telegram or Top-Up link),
          <span className="text-indigo-300 font-medium"> every single page using that link automatically updates immediately</span>. You never need to edit pages one by one.
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-900/60 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Links List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading Link Library...</div>
      ) : filteredLinks.length === 0 ? (
        <div className="py-12 text-center rounded-2xl glass-panel text-slate-400 text-xs">
          No links found in this category. Click &quot;Add New Link&quot; to create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredLinks.map((link) => {
            const pageUsage = link._count?.pageComponents || 0;
            return (
              <div
                key={link.id}
                className={`p-4 rounded-2xl glass-panel transition-all flex flex-col justify-between ${
                  !link.isActive ? "opacity-60 border-dashed" : ""
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 flex items-center justify-center flex-shrink-0">
                        <DynamicIcon name={link.icon} className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white truncate">
                            {link.title}
                          </h3>
                          {link.badge && (
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {link.badge}
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                            {link.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {link.description || "No description provided"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleActive(link)}
                      title={link.isActive ? "Link is Active (Publicly visible)" : "Link is Inactive (Hidden)"}
                      className="text-slate-400 hover:text-white"
                    >
                      {link.isActive ? (
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                          Disabled
                        </span>
                      )}
                    </button>
                  </div>

                  {/* URL */}
                  <div className="mt-2 py-1.5 px-2.5 rounded-lg bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="truncate max-w-[280px]">{link.url}</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-indigo-400 hover:text-indigo-300 flex-shrink-0"
                      title="Open destination"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Footer metadata & actions */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-indigo-300">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Used in {pageUsage} page{pageUsage === 1 ? "" : "s"}</span>
                    </span>
                    <span className="text-[11px] text-slate-500">•</span>
                    <span className="text-[11px] text-slate-400">
                      {link.clickCount} clicks
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(link)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                      title="Edit Link"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(link)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
                      title="Delete Link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white">
                {editingLink ? "Edit Reusable Link" : "Create Reusable Link"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Link Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Free Fire Top Up, Official YouTube"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Destination URL *
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/destination"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Instant Delivery • 24/7 Automated UID Top Up"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Icon
                </label>
                <IconPicker
                  value={formData.icon}
                  onChange={(iconName) => setFormData({ ...formData, icon: iconName })}
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Service">Service</option>
                    <option value="Social">Social</option>
                    <option value="Download">Download</option>
                    <option value="Video">Video</option>
                    <option value="Utility">Utility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="HOT, NEW, FAST, v1.0"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Component Card Type Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Card Display Style
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="standard">Standard Glass Link Card</option>
                  <option value="featured">Featured / Glowing Highlight</option>
                  <option value="social">Social Platform Card</option>
                  <option value="download">Download Link Card</option>
                  <option value="video">Video Guide Card</option>
                </select>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5">
                <div>
                  <p className="text-xs font-semibold text-white">Active Status</p>
                  <p className="text-[11px] text-slate-400">If disabled, this link will be hidden from all public pages.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingLink ? "Save Changes" : "Create Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}