"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileStack,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  X,
  Check,
  Eye,
  Star,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Layers,
} from "lucide-react";
import { DynamicIcon, AVAILABLE_ICONS } from "@/lib/icons";

interface LinkItem {
  id: string;
  title: string;
  icon: string;
  type: string;
  isActive: boolean;
}

interface PageComponent {
  id?: string;
  componentType: string;
  linkId?: string | null;
  link?: LinkItem | null;
  headingText?: string | null;
  announcementText?: string | null;
  announcementUrl?: string | null;
  isVisible: boolean;
  position: number;
}

interface PageItem {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  isMain: boolean;
  isActive: boolean;
  viewsCount: number;
  createdAt: string;
  _count?: { components: number };
  components?: PageComponent[];
}

const COMPONENT_TYPES = [
  { value: "LINK_CARD", label: "Standard Link" },
  { value: "FEATURED_LINK", label: "Featured Link" },
  { value: "SOCIAL_LINK", label: "Social Link" },
  { value: "DOWNLOAD_LINK", label: "Download Link" },
  { value: "VIDEO_LINK", label: "Video Link" },
  { value: "SECTION_HEADING", label: "Section Heading" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
];

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [allLinks, setAllLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [managingPage, setManagingPage] = useState<PageItem | null>(null);
  const [pageComponents, setPageComponents] = useState<PageComponent[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Create form
  const [createForm, setCreateForm] = useState({
    name: "",
    slug: "",
    title: "",
    description: "",
    isMain: false,
    seoTitle: "",
    seoDescription: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const [pagesRes, linksRes] = await Promise.all([
        fetch("/api/admin/pages"),
        fetch("/api/admin/links"),
      ]);
      const pagesData = await pagesRes.json();
      const linksData = await linksRes.json();
      setPages(pagesData.pages || []);
      setAllLinks(linksData.links || []);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const autoSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50);
  };

  const handleCreatePage = async () => {
    if (!createForm.name || !createForm.slug) {
      setError("Name and slug are required.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create page.");
        return;
      }
      setShowCreateModal(false);
      setCreateForm({ name: "", slug: "", title: "", description: "", isMain: false, seoTitle: "", seoDescription: "" });
      fetchData();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page? All components will be removed.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete.");
      }
      fetchData();
    } catch {
      // Ignore
    } finally {
      setDeleting(null);
    }
  };

  const openManagePage = async (page: PageItem) => {
    try {
      const res = await fetch(`/api/admin/pages/${page.id}`);
      const data = await res.json();
      setManagingPage(data.page);
      setPageComponents(data.page.components || []);
    } catch {
      // Ignore
    }
  };

  const addComponent = () => {
    setPageComponents([
      ...pageComponents,
      {
        componentType: "LINK_CARD",
        linkId: null,
        headingText: null,
        isVisible: true,
        position: pageComponents.length,
      },
    ]);
  };

  const removeComponent = (index: number) => {
    setPageComponents(pageComponents.filter((_, i) => i !== index));
  };

  const updateComponent = (index: number, updates: Partial<PageComponent>) => {
    const newComps = [...pageComponents];
    newComps[index] = { ...newComps[index], ...updates };
    setPageComponents(newComps);
  };

  const moveComponent = (index: number, direction: "up" | "down") => {
    const newComps = [...pageComponents];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newComps.length) return;
    [newComps[index], newComps[targetIndex]] = [newComps[targetIndex], newComps[index]];
    setPageComponents(newComps);
  };

  const saveComponents = async () => {
    if (!managingPage) return;
    setSaving(true);

    try {
      const payload = pageComponents.map((comp, i) => ({
        componentType: comp.componentType,
        linkId: comp.linkId || null,
        headingText: comp.headingText || null,
        announcementText: comp.announcementText || null,
        announcementUrl: comp.announcementUrl || null,
        isVisible: comp.isVisible,
        position: i,
      }));

      await fetch(`/api/admin/pages/${managingPage.id}/components`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ components: payload }),
      });

      setManagingPage(null);
      fetchData();
    } catch {
      // Ignore
    } finally {
      setSaving(false);
    }
  };

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
            <FileStack className="w-6 h-6 text-purple-400" />
            Pages
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create pages for any platform — TikTok, YouTube, Facebook, or anything else
          </p>
        </div>
        <button
          onClick={() => {
            setError("");
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-sm font-semibold hover:from-purple-500 hover:to-indigo-400 transition-all active:scale-[0.97] shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>

      {/* Pages list */}
      <div className="space-y-3">
        {pages.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No pages yet. Create your first page!
          </div>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className={`p-5 rounded-2xl bg-white/[0.02] border transition-all hover:bg-white/[0.04] ${
                page.isMain ? "border-indigo-500/25" : "border-white/[0.06]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-white">{page.name}</h3>
                    {page.isMain && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5" />
                        MAIN PAGE
                      </span>
                    )}
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      page.isActive
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                        : "bg-red-500/15 text-red-300 border border-red-500/20"
                    }`}>
                      {page.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    <span className="font-mono text-indigo-400/70">/{page.slug}</span>
                    {page.description && <span className="ml-2 text-slate-500">— {page.description}</span>}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>{page._count?.components || 0} components</span>
                    <span>{page.viewsCount} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {!page.isMain && (
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => openManagePage(page)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    title="Manage Components"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                  {!page.isMain && (
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      disabled={deleting === page.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === page.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0d1117] border border-white/[0.08] rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Create New Page</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-400">
              Create a page for any purpose — TikTok video links, YouTube description, Facebook bio, promo campaigns, or anything you need!
            </p>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Page Name *</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => {
                    setCreateForm({
                      ...createForm,
                      name: e.target.value,
                      slug: autoSlug(e.target.value),
                    });
                  }}
                  placeholder="e.g. TikTok Video 01, YouTube Bio, Promo Campaign"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Slug *</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">yoursite.com/</span>
                  <input
                    type="text"
                    value={createForm.slug}
                    onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value })}
                    placeholder="tiktok-01"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Page Title</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Displayed on the page header"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Brief description for visitors"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={handleCreatePage}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-sm font-semibold hover:from-purple-500 hover:to-indigo-400 transition-all disabled:opacity-50 shadow-lg shadow-purple-600/20"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Create Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Components Modal */}
      {managingPage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setManagingPage(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0d1117] border border-white/[0.08] rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Manage Components</h2>
                <p className="text-sm text-slate-400">{managingPage.name} — /{managingPage.slug}</p>
              </div>
              <button onClick={() => setManagingPage(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Components list */}
            <div className="space-y-2">
              {pageComponents.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500">
                  No components yet. Add links, headings, or announcements below.
                </div>
              ) : (
                pageComponents.map((comp, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
                  >
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => moveComponent(index, "up")}
                        disabled={index === 0}
                        className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveComponent(index, "down")}
                        disabled={index === pageComponents.length - 1}
                        className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Component config */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          value={comp.componentType}
                          onChange={(e) => updateComponent(index, { componentType: e.target.value })}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                        >
                          {COMPONENT_TYPES.map((ct) => (
                            <option key={ct.value} value={ct.value}>{ct.label}</option>
                          ))}
                        </select>

                        {comp.componentType === "SECTION_HEADING" ? (
                          <input
                            type="text"
                            value={comp.headingText || ""}
                            onChange={(e) => updateComponent(index, { headingText: e.target.value })}
                            placeholder="Heading text..."
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 min-w-[150px]"
                          />
                        ) : comp.componentType === "ANNOUNCEMENT" ? (
                          <input
                            type="text"
                            value={comp.announcementText || ""}
                            onChange={(e) => updateComponent(index, { announcementText: e.target.value })}
                            placeholder="Announcement text..."
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 min-w-[150px]"
                          />
                        ) : (
                          <select
                            value={comp.linkId || ""}
                            onChange={(e) => updateComponent(index, { linkId: e.target.value || null })}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50 min-w-[150px]"
                          >
                            <option value="">— Select a link —</option>
                            {allLinks.filter(l => l.isActive).map((link) => (
                              <option key={link.id} value={link.id}>{link.title}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeComponent(index)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add component */}
            <button
              onClick={addComponent}
              className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.12] text-sm text-slate-400 hover:text-white hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Component
            </button>

            {/* Save */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setManagingPage(null)} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={saveComponents}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold hover:from-indigo-500 hover:to-indigo-400 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Save Components
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
