"use client";

import React from "react";
import { Smartphone } from "lucide-react";
import ComponentRenderer, { RenderableComponent } from "@/components/public/ComponentRenderer";
import ProfileHeader from "@/components/public/ProfileHeader";
import BackgroundGlow from "@/components/public/BackgroundGlow";

interface LiveSimulatorProps {
  siteSettings: any;
  title: string;
  name: string;
  description: string;
  isMain: boolean;
  components: RenderableComponent[];
  pageId: string;
}

export default function LiveSimulator({
  siteSettings,
  title,
  name,
  description,
  isMain,
  components,
  pageId,
}: LiveSimulatorProps) {
  const accentColor = siteSettings?.accentColor || "#6366f1";

  return (
    <div className="sticky top-6">
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Live Mobile Simulator
          </span>
        </div>
        <span className="text-[11px] text-emerald-400 font-medium">Real-time sync</span>
      </div>

      {/* Phone Frame */}
      <div className="relative mx-auto w-full max-w-[360px] h-[680px] rounded-[42px] border-[6px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
        {/* Dynamic Island / Camera notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-slate-900 border border-white/10 z-20" />

        {/* Screen Content Scrollable */}
        <div className="flex-1 overflow-y-auto px-1 pt-6 pb-8 relative selection:bg-indigo-500 selection:text-white">
          <BackgroundGlow accentColor={accentColor} />

          <ProfileHeader
            brandName={siteSettings?.brandName || "Mobin X"}
            username={siteSettings?.username || "@mobinx"}
            bio={siteSettings?.bio || ""}
            avatarUrl={siteSettings?.avatarUrl || ""}
            isExtraPage={!isMain}
            pageTitle={title || name}
            pageDescription={description}
            accentColor={accentColor}
          />

          <ComponentRenderer
            components={components}
            pageId={pageId}
            accentColor={accentColor}
          />
        </div>

        {/* Home bar */}
        <div className="py-2 flex justify-center bg-slate-950 border-t border-white/5">
          <div className="w-28 h-1 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}