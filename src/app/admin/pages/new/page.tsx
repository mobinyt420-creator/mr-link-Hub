"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Check, AlertCircle, Globe } from "lucide-react";
import { validateSlug } from "@/lib/validation";

export default function CreateNewPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Live slug validation
  const validation = slug ? validateSlug(slug) : { valid: true };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug) {
      // Auto-suggest slug
      const suggested = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(suggested);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Page Name is required.");
      return;
    }

    const valResult = validateSlug(slug);
    if (!valResult.valid) {
      setError(valResult.error || "Invalid slug.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: valResult.cleanedSlug,
          title: title.trim() || name.trim(),
          description: description.trim(),
          seoTitle: seoTitle.trim(),
          seoDescription: seoDescription.trim(),
          isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create page.");
        setSubmitting(false);
        return;
      }

      // Redirect directly to the page builder
      router.push(`/admin/pages/${data.page.id}/edit`);
    } catch {
      setError("An unexpected network error occurred.");
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Pages List</span>
        </Link>
      </div>

      <div className="p-6 rounded-3xl glass-panel space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Create Dynamic Extra Page
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build a dedicated landing page for a specific TikTok video, YouTube link, or campaign
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Page Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Page Name *
            </label>
            <input
              type="text"
              placeholder="e.g. TikTok Video 01, Proxy VIP Download, Top Up Promo"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              URL Slug *
            </label>
            <div className="flex items-center rounded-xl bg-slate-950/80 border border-white/10 px-3 py-2 text-sm focus-within:border-indigo-500">
              <span className="text-slate-500 font-mono text-xs select-none">
                mydomain.com/
              </span>
              <input
                type="text"
                placeholder="tiktok-01"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                required
                className="bg-transparent flex-1 text-white font-mono text-xs sm:text-sm pl-1 focus:outline-none"
              />
            </div>
            {!validation.valid && slug && (
              <p className="text-[11px] text-amber-400 mt-1.5">{validation.error}</p>
            )}
            {validation.valid && slug && (
              <p className="text-[11px] text-indigo-400 mt-1.5 flex items-center gap-1 font-mono">
                <Globe className="w-3 h-3" />
                <span>Public URL: /{slug}</span>
              </p>
            )}
          </div>

          {/* Page Title & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Display Title (Optional)
              </label>
              <input
                type="text"
                placeholder="Shown at top of page"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Subtitle (Optional)
              </label>
              <input
                type="text"
                placeholder="Quick context for visitors"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              SEO & Social Sharing Preview
            </h3>
            <div>
              <input
                type="text"
                placeholder="Custom SEO Title (e.g. Mobin X — Top Up & YouTube)"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Custom Meta Description for WhatsApp/Telegram preview"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/50 border border-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Publish Immediately</p>
              <p className="text-[11px] text-slate-400">Page will be publicly accessible once saved.</p>
            </div>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/admin/pages"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || (slug ? !validation.valid : false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? "Creating..." : "Continue to Page Builder"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}