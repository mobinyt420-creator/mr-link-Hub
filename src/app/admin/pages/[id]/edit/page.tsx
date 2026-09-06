"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  Check,
  AlertCircle,
  Smartphone,
  Type,
  BellRing,
} from "lucide-react";
import { DynamicIcon } from "@/lib/icons";
import { RenderableComponent } from "@/components/public/ComponentRenderer";
import LiveSimulator from "@/components/admin/LiveSimulator";
import AddComponentModal from "@/components/admin/AddComponentModal";
import { validateSlug } from "@/lib/validation";

export default function EditPageBuilder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isMain, setIsMain] = useState(false);

  const [components, setComponents] = useState<RenderableComponent[]>([]);
  const [libraryLinks, setLibraryLinks] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  const [addComponentOpen, setAddComponentOpen] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    fetchPageData();
    fetchLibraryLinks();
    fetchSettings();
  }, [id]);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pages/${id}`);
      if (!res.ok) throw new Error("Failed to load page");
      const data = await res.json();
      const page = data.page;

      setName(page.name);
      setSlug(page.slug);
      setTitle(page.title || "");
      setDescription(page.description || "");
      setSeoTitle(page.seoTitle || "");
      setSeoDescription(page.seoDescription || "");
      setIsActive(page.isActive);
      setIsMain(page.isMain);
      setComponents(page.components || []);
    } catch {
      setError("Failed to load page data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLibraryLinks = async () => {
    try {
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        setLibraryLinks(data.links || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSiteSettings(data.settings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newComps = [...components];
    const temp = newComps[index];
    newComps[index] = newComps[index - 1];
    newComps[index - 1] = temp;
    setComponents(newComps.map((c, i) => ({ ...c, position: i })));
  };

  const handleMoveDown = (index: number) => {
    if (index === components.length - 1) return;
    const newComps = [...components];
    const temp = newComps[index];
    newComps[index] = newComps[index + 1];
    newComps[index + 1] = temp;
    setComponents(newComps.map((c, i) => ({ ...c, position: i })));
  };

  const handleToggleVisibility = (index: number) => {
    const newComps = [...components];
    newComps[index].isVisible = !newComps[index].isVisible;
    setComponents(newComps);
  };

  const handleRemoveComponent = (index: number) => {
    const newComps = components.filter((_, i) => i !== index);
    setComponents(newComps.map((c, i) => ({ ...c, position: i })));
  };

  const handleSaveAll = async () => {
    if (!name.trim()) {
      setError("Page Name is required.");
      return;
    }

    if (!isMain) {
      const valResult = validateSlug(slug);
      if (!valResult.valid) {
        setError(valResult.error || "Invalid slug.");
        return;
      }
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        name: name.trim(),
        slug: isMain ? "_main" : slug.trim(),
        title: title.trim(),
        description: description.trim(),
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
        isActive,
        components: components.map((comp, idx) => ({
          componentType: comp.componentType,
          linkId: comp.link?.id || null,
          position: idx,
          customTitle: comp.customTitle || null,
          customDescription: comp.customDescription || null,
          customBadge: comp.customBadge || null,
          headingText: comp.headingText || null,
          announcementText: comp.announcementText || null,
          announcementUrl: comp.announcementUrl || null,
          isVisible: comp.isVisible !== false,
        })),
      };

      const res = await fetch(`/api/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save page.");
        setSaving(false);
        return;
      }

      setSuccessMessage("Page saved! Live changes applied instantly.");
      setTimeout(() => setSuccessMessage(""), 4000);
      fetchPageData();
    } catch {
      setError("A network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 min-h-[50vh] flex items-center justify-center">
        Loading Page Builder...
      </div>
    );
  }

  const liveUrl = isMain ? "/" : `/${slug}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {name}
              </h1>
              {isMain && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  MAIN SITE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              URL: <span className="font-mono text-indigo-400">{liveUrl}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className={`xl:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
              showMobilePreview
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-slate-900 border-white/10 text-slate-300 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{showMobilePreview ? "Hide Preview" : "Live Preview"}</span>
          </button>

          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Live</span>
          </a>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className={`space-y-6 ${showMobilePreview ? "hidden xl:block xl:col-span-7" : "xl:col-span-7"}`}>
          {/* Settings */}
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Page Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Page Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL Slug {!isMain && "*"}
                </label>
                <input
                  type="text"
                  value={slug}
                  disabled={isMain}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 ${
                    isMain ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Header Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Shown in header on this page"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Short description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <p className="text-xs font-medium text-white">Public Status</p>
                <p className="text-[11px] text-slate-400">Visitors can view this page when active.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {isActive ? "Published (ON)" : "Hidden (OFF)"}
              </button>
            </div>
          </div>

          {/* Components List */}
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Page Components ({components.length})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reorder and customize components for this page
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAddComponentOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Component</span>
              </button>
            </div>

            {components.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl border border-dashed border-white/10 text-slate-400 text-xs">
                No components added yet. Click &quot;Add Component&quot; to pick links from your library!
              </div>
            ) : (
              <div className="space-y-2.5">
                {components.map((comp, index) => {
                  const isHeading = comp.componentType === "SECTION_HEADING";
                  const isAnnouncement = comp.componentType === "ANNOUNCEMENT";
                  const compTitle = isHeading
                    ? comp.headingText
                    : isAnnouncement
                    ? comp.announcementText
                    : comp.customTitle || comp.link?.title || "Untitled Link";

                  return (
                    <div
                      key={comp.id || index}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        !comp.isVisible
                          ? "bg-slate-950/40 border-dashed border-white/5 opacity-50"
                          : isHeading
                          ? "bg-indigo-950/25 border-indigo-500/25"
                          : "bg-slate-900/80 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex flex-col gap-0.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === components.length - 1}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-white/10 text-indigo-400 flex-shrink-0">
                          {isHeading ? (
                            <Type className="w-4 h-4 text-amber-400" />
                          ) : isAnnouncement ? (
                            <BellRing className="w-4 h-4 text-purple-400" />
                          ) : (
                            <DynamicIcon name={comp.link?.icon || "ExternalLink"} className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold text-white truncate">
                              {compTitle}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              {comp.componentType.replace("_", " ")}
                            </span>
                          </div>
                          {comp.link?.url && (
                            <p className="text-[11px] text-slate-500 font-mono truncate">
                              {comp.link.url}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(index)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            comp.isVisible
                              ? "bg-slate-800 border-white/10 text-emerald-400"
                              : "bg-slate-950 border-white/5 text-slate-600"
                          }`}
                        >
                          {comp.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveComponent(index)}
                          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-600 border border-white/5 text-slate-400 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Live Mobile Simulator */}
        <div className={`xl:col-span-5 ${!showMobilePreview ? "hidden xl:block" : "block"}`}>
          <LiveSimulator
            siteSettings={siteSettings}
            title={title}
            name={name}
            description={description}
            isMain={isMain}
            components={components}
            pageId={id}
          />
        </div>
      </div>

      <AddComponentModal
        isOpen={addComponentOpen}
        onClose={() => setAddComponentOpen(false)}
        libraryLinks={libraryLinks}
        onAdd={(comp) => setComponents([...components, comp])}
        currentCount={components.length}
      />
    </div>
  );
}