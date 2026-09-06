"use client";

import React, { useState, useRef } from "react";
import { AVAILABLE_ICONS, DynamicIcon } from "@/lib/icons";
import { Search, X, Check, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (iconNameOrUrl: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"LIBRARY" | "UPLOAD">("LIBRARY");
  const [search, setSearch] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredIcons = AVAILABLE_ICONS.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const isCustomImage =
    value?.startsWith("http://") ||
    value?.startsWith("https://") ||
    value?.startsWith("data:image/") ||
    value?.startsWith("/");

  // Handle local file upload (converts to base64 Data URI)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be under 2MB for fast performance.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange(result);
        setIsOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    onChange(customUrl.trim());
    setCustomUrl("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/50 text-left transition-all w-full group"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center flex-shrink-0 p-1">
          <DynamicIcon name={value} className="w-7 h-7" size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-slate-400">Selected Logo / Icon</p>
          <p className="text-xs sm:text-sm font-semibold text-white truncate">
            {isCustomImage ? "Custom Logo Uploaded" : value || "ExternalLink"}
          </p>
        </div>
        <span className="text-xs text-indigo-400 font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
          Change Logo
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Select or Upload Logo</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-2 gap-1.5 border-b border-white/10 bg-slate-950/50">
              <button
                type="button"
                onClick={() => setActiveTab("LIBRARY")}
                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === "LIBRARY"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Official Icons & Logos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("UPLOAD")}
                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === "UPLOAD"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Upload Custom Logo
              </button>
            </div>

            {/* TAB 1: Icon Library */}
            {activeTab === "LIBRARY" && (
              <>
                <div className="p-3 border-b border-white/10">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Telegram, YouTube, Diamond, Zap..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {filteredIcons.map((item) => {
                    const isSelected = item.name === value;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          onChange(item.name);
                          setIsOpen(false);
                        }}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "bg-indigo-600/30 border-indigo-500 text-white"
                            : "bg-slate-950/60 border-white/5 text-slate-300 hover:bg-slate-800/80 hover:border-white/20"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-1">
                          <DynamicIcon name={item.name} className="w-7 h-7" size={28} />
                        </div>
                        <span className="text-[11px] font-semibold truncate w-full">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* TAB 2: Upload Custom Logo */}
            {activeTab === "UPLOAD" && (
              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                {/* File Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/60 hover:bg-indigo-950/20 transition-all flex flex-col items-center gap-2.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">Click to Upload Image File</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Supports PNG, JPG, WebP, SVG (Max 2MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[1px] bg-white/10" />
                  <span className="text-[11px] text-slate-500 uppercase font-mono">OR PASTE URL</span>
                  <div className="flex-1 h-[1px] bg-white/10" />
                </div>

                {/* Paste Direct Image Link */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Direct Image URL:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="https://example.com/logo.png"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/10 text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
                    >
                      Use URL
                    </button>
                  </div>
                </div>

                {isCustomImage && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/10 flex items-center gap-3">
                    <img src={value} alt="Preview" className="w-10 h-10 object-contain rounded-lg border border-white/10" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-emerald-400">Current Custom Logo</p>
                      <p className="text-[10px] text-slate-400 truncate font-mono">{value.slice(0, 40)}...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}