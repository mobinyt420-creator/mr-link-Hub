"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Link2, Type, BellRing, X, Check } from "lucide-react";
import { DynamicIcon } from "@/lib/icons";
import { RenderableComponent } from "@/components/public/ComponentRenderer";

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
}

interface AddComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  libraryLinks: LinkItem[];
  onAdd: (component: RenderableComponent) => void;
  currentCount: number;
}

export default function AddComponentModal({
  isOpen,
  onClose,
  libraryLinks,
  onAdd,
  currentCount,
}: AddComponentModalProps) {
  const [addType, setAddType] = useState<"LINK" | "HEADING" | "ANNOUNCEMENT">("LINK");
  const [selectedLinkId, setSelectedLinkId] = useState(libraryLinks[0]?.id || "");
  const [headingInput, setHeadingInput] = useState("");
  const [announcementInput, setAnnouncementInput] = useState("");
  const [announcementUrlInput, setAnnouncementUrlInput] = useState("");

  if (!isOpen) return null;

  const handleInsert = () => {
    if (addType === "LINK") {
      const linkObj = libraryLinks.find((l) => l.id === selectedLinkId) || libraryLinks[0];
      if (!linkObj) return;

      const compType =
        linkObj.type === "featured"
          ? "FEATURED_LINK"
          : linkObj.type === "download"
          ? "DOWNLOAD_LINK"
          : linkObj.type === "video"
          ? "VIDEO_LINK"
          : linkObj.type === "social"
          ? "SOCIAL_LINK"
          : "LINK_CARD";

      onAdd({
        id: `temp-${Date.now()}`,
        componentType: compType,
        position: currentCount,
        isVisible: true,
        link: linkObj,
      });
    } else if (addType === "HEADING") {
      if (!headingInput.trim()) return;
      onAdd({
        id: `temp-${Date.now()}`,
        componentType: "SECTION_HEADING",
        headingText: headingInput.trim(),
        position: currentCount,
        isVisible: true,
      });
      setHeadingInput("");
    } else if (addType === "ANNOUNCEMENT") {
      if (!announcementInput.trim()) return;
      onAdd({
        id: `temp-${Date.now()}`,
        componentType: "ANNOUNCEMENT",
        announcementText: announcementInput.trim(),
        announcementUrl: announcementUrlInput.trim() || null,
        position: currentCount,
        isVisible: true,
      });
      setAnnouncementInput("");
      setAnnouncementUrlInput("");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-base font-bold text-white">Add Component to Page</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selector Tabs */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setAddType("LINK")}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
              addType === "LINK"
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-slate-950 border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Link Library</span>
          </button>

          <button
            type="button"
            onClick={() => setAddType("HEADING")}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
              addType === "HEADING"
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-slate-950 border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Heading</span>
          </button>

          <button
            type="button"
            onClick={() => setAddType("ANNOUNCEMENT")}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
              addType === "ANNOUNCEMENT"
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-slate-950 border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>Alert Banner</span>
          </button>
        </div>

        {/* Form fields based on selected type */}
        {addType === "LINK" && (
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-slate-300">
              Select Destination from Library:
            </label>
            {libraryLinks.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-400 text-center">
                No links in Link Library yet.
                <Link href="/admin/links" className="text-indigo-400 ml-1 underline">
                  Create links first
                </Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {libraryLinks.map((link) => {
                  const isSelected = link.id === selectedLinkId;
                  return (
                    <div
                      key={link.id}
                      onClick={() => setSelectedLinkId(link.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-600/30 border-indigo-500 text-white"
                          : "bg-slate-950 border-white/5 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
                          <DynamicIcon name={link.icon} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{link.title}</p>
                          <p className="text-[11px] text-slate-400 truncate">{link.url}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 ml-2" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {addType === "HEADING" && (
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-slate-300">
              Section Title
            </label>
            <input
              type="text"
              placeholder="e.g. 🔥 Featured Services, Downloads & Tools"
              value={headingInput}
              onChange={(e) => setHeadingInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {addType === "ANNOUNCEMENT" && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Announcement Message
              </label>
              <input
                type="text"
                placeholder="e.g. 🔥 50% Top-Up Bonus available today!"
                value={announcementInput}
                onChange={(e) => setAnnouncementInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Action URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://example.com/promo"
                value={announcementUrlInput}
                onChange={(e) => setAnnouncementUrlInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            Insert Component
          </button>
        </div>
      </div>
    </div>
  );
}