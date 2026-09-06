"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Trash2,
  Eye,
  MousePointerClick,
  Sparkles,
  Globe,
  ToggleLeft,
  ToggleRight,
  Filter,
} from "lucide-react";

interface PageItem {
  id: string;
  name: string;
  slug: string;
  isMain: boolean;
  title: string;
  description: string;
  isActive: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    components: number;
    analytics: number;
  };
}

export default function AdminPagesListPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/pages");
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (slug: string, isMain: boolean, id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = isMain ? `${origin}/` : `${origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setToastMessage(`Copied: ${url}`);
    setTimeout(() => {
      setCopiedId(null);
      setToastMessage("");
    }, 3000);
  };

  const handleToggleActive = async (page: PageItem) => {
    try {
      const res = await fetch(`/api/pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !page.isActive }),
      });
      if (res.ok) {
        setToastMessage(`Page "${page.name}" is now ${!page.isActive ? "Active" : "Disabled"}.`);
        setTimeout(() => setToastMessage(""), 3000);
        fetchPages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDuplicate = async (page: PageItem) => {
    try {
      const res = await fetch(`/api/pages/${page.id}/duplicate`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setToastMessage(`Duplicated page: "${data.page.name}". You can now edit it.`);
        setTimeout(() => setToastMessage(""), 4000);
        fetchPages();
      } else {
        alert(data.error || "Failed to duplicate page.");
      }
    } catch {
      alert("A network error occurred while duplicating.");
    }
  };

  const handleDelete = async (page: PageItem) => {
    if (page.isMain) {
      alert("The permanent Main Website cannot be deleted.");
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete "${page.name}" (/${page.slug})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/pages/${page.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setToastMessage(`Deleted page: "${page.name}".`);
        setTimeout(() => setToastMessage(""), 3000);
        fetchPages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.name.toLowerCase().includes(search.toLowerCase()) ||
      page.slug.toLowerCase().includes(search.toLowerCase()) ||
      page.title.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === "ACTIVE") return matchesSearch && page.isActive;
    if (filterStatus === "INACTIVE") return matchesSearch && !page.isActive;
    return matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Pages Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Permanent Main Website + Unlimited Dynamic Extra Pages for videos & campaigns
          </p>
        </div>

        <Link
          href="/admin/pages/new"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create Extra Page</span>
        </Link>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filterStatus === status
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900/60 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Pages List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading pages...</div>
      ) : filteredPages.length === 0 ? (
        <div className="py-12 text-center rounded-2xl glass-panel text-slate-400 text-xs">
          No pages match your search criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPages.map((page) => {
            const pageUrl = page.isMain ? "/" : `/${page.slug}`;

            return (
              <div
                key={page.id}
                className={`p-4 sm:p-5 rounded-2xl glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  !page.isActive ? "opacity-60 border-dashed" : ""
                }`}
              >
                {/* Info Column */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-white truncate">
                      {page.name}
                    </h3>

                    {page.isMain ? (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Permanent Main Website
                      </span>
                    ) : (
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/5">
                        /{page.slug}
                      </span>
                    )}

                    <button
                      onClick={() => handleToggleActive(page)}
                      className="ml-1"
                      title={page.isActive ? "Page is Active" : "Page is Disabled"}
                    >
                      {page.isActive ? (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                          Disabled
                        </span>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {page.description || "No custom subtitle"}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
                    <span className="text-slate-400">
                      {page._count.components} active components
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>{page.viewsCount} views</span>
                    </span>
                    <span>•</span>
                    <span>
                      Created {new Date(page.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions Column */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                  {/* Copy URL */}
                  <button
                    onClick={() => handleCopyUrl(page.slug, page.isMain, page.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-xs text-slate-300 hover:text-white transition-colors"
                    title="Copy Page URL"
                  >
                    {copiedId === page.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{copiedId === page.id ? "Copied" : "Copy URL"}</span>
                  </button>

                  {/* Open Live */}
                  <a
                    href={pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-xs text-slate-300 hover:text-white transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>Open</span>
                  </a>

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicate(page)}
                    className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 transition-colors"
                    title="Duplicate this page (1-Click Clone)"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <Link
                    href={page.isMain ? "/admin/main-site" : `/admin/pages/${page.id}/edit`}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  {/* Delete (Hidden for Main Website) */}
                  {!page.isMain && (
                    <button
                      onClick={() => handleDelete(page)}
                      className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-red-600 text-slate-400 hover:text-white transition-colors"
                      title="Delete Page"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}