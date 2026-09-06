"use client";

import React from "react";
import { DynamicIcon } from "@/lib/icons";
import { ArrowUpRight } from "lucide-react";

export interface RenderableComponent {
  id: string;
  componentType: string;
  position: number;
  customTitle?: string | null;
  customDescription?: string | null;
  customBadge?: string | null;
  headingText?: string | null;
  announcementText?: string | null;
  announcementUrl?: string | null;
  isVisible: boolean;
  link?: {
    id: string;
    title: string;
    description: string;
    url: string;
    icon: string;
    type: string;
    category: string;
    badge: string;
    isActive: boolean;
  } | null;
}

interface ComponentRendererProps {
  components: RenderableComponent[];
  pageId: string;
  accentColor?: string;
}

// ─── Brand detection helper ───
function detectBrand(title: string, icon: string): string {
  const t = (title || "").toLowerCase();
  const ic = (icon || "").toLowerCase();
  if (t.includes("telegram") || ic.includes("telegram") || ic.includes("send")) return "telegram";
  if (t.includes("youtube") || ic.includes("youtube")) return "youtube";
  if (t.includes("whatsapp") || ic.includes("whatsapp") || ic.includes("messagecircle")) return "whatsapp";
  if (t.includes("top up") || t.includes("topup") || t.includes("diamond") || ic.includes("diamond")) return "diamond";
  if (t.includes("download") || t.includes("apk") || ic.includes("download")) return "download";
  return "default";
}

// ─── Icon container class by brand ───
function getIconContainerClass(brand: string): string {
  switch (brand) {
    case "telegram": return "icon-container icon-container-telegram";
    case "youtube": return "icon-container icon-container-youtube";
    case "whatsapp": return "icon-container icon-container-whatsapp";
    case "diamond": return "icon-container icon-container-diamond animate-diamond-pulse";
    default: return "icon-container icon-container-default";
  }
}

// ─── Action button configuration by brand ───
function getButtonConfig(brand: string, compType: string) {
  switch (brand) {
    case "telegram":
      return {
        label: "Join",
        classes: "bg-[#229ED9]/15 text-[#56bfee] border-[#229ED9]/25 hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9]",
      };
    case "youtube":
      return {
        label: "Subscribe",
        classes: "bg-[#FF0000]/12 text-[#ff6b6b] border-[#FF0000]/25 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
      };
    case "whatsapp":
      return {
        label: "Chat",
        classes: "bg-[#25D366]/12 text-[#5ee89c] border-[#25D366]/25 hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
      };
    case "diamond":
      return {
        label: "Top Up",
        classes: "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white border-blue-500/30 shadow-sm shadow-blue-500/20",
      };
    case "download":
      return {
        label: "Download",
        classes: "bg-emerald-500/12 text-emerald-300 border-emerald-500/25 hover:bg-emerald-500 hover:text-white hover:border-emerald-500",
      };
    default:
      return {
        label: "Open",
        classes: "bg-indigo-500/12 text-indigo-300 border-indigo-500/25 hover:bg-indigo-600 hover:text-white hover:border-indigo-600",
      };
  }
}

export default function ComponentRenderer({
  components,
  pageId,
}: ComponentRendererProps) {
  // Beacon tracking
  const handleLinkClick = (linkId?: string) => {
    if (!linkId) return;
    try {
      const payload = JSON.stringify({
        eventType: "LINK_CLICK",
        linkId,
        pageId,
      });

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/track", blob);
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore silently
    }
  };

  const visibleComponents = components
    .filter((comp) => {
      if (!comp.isVisible) return false;
      if (comp.link && !comp.link.isActive) return false;
      return true;
    })
    .sort((a, b) => a.position - b.position);

  if (visibleComponents.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl glass-card max-w-lg mx-auto">
        <p className="text-sm text-slate-400">No active links available right now.</p>
        <p className="text-xs text-slate-500 mt-1">Please check back shortly!</p>
      </div>
    );
  }

  // Track visible card index for staggered animation delay
  let cardIndex = 0;

  return (
    <div className="flex flex-col gap-3 w-full max-w-lg mx-auto px-4 pb-12">
      {visibleComponents.map((comp) => {
        const title = comp.customTitle || comp.link?.title || "";
        const description = comp.customDescription || comp.link?.description || "";
        const badge = comp.customBadge || comp.link?.badge || "";
        const url = comp.link?.url || "#";
        const icon = comp.link?.icon || "ExternalLink";
        const linkId = comp.link?.id;

        // 1. SECTION HEADING
        if (comp.componentType === "SECTION_HEADING") {
          return (
            <div
              key={comp.id}
              className="pt-4 pb-1 animate-fade-in-up"
              style={{ animationDelay: `${cardIndex++ * 60}ms` }}
            >
              <div className="flex items-center gap-3">
                <h3 className="text-[10.5px] font-extrabold tracking-[0.15em] text-slate-500 uppercase">
                  {comp.headingText || "Links"}
                </h3>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
              </div>
            </div>
          );
        }

        // 2. IN-PAGE ANNOUNCEMENT
        if (comp.componentType === "ANNOUNCEMENT") {
          return (
            <div
              key={comp.id}
              className="p-3.5 rounded-2xl glass-card border-indigo-500/20 text-xs text-indigo-200 flex items-center justify-between animate-fade-in-up"
              style={{
                animationDelay: `${cardIndex++ * 60}ms`,
                borderColor: "rgba(99, 102, 241, 0.2)",
                boxShadow: "inset 0 0 30px -12px rgba(99, 102, 241, 0.15), 0 4px 16px -6px rgba(0,0,0,0.3)",
              }}
            >
              <span className="font-medium">{comp.announcementText || "Announcement"}</span>
              {comp.announcementUrl && (
                <a
                  href={comp.announcementUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 font-bold underline underline-offset-2 text-indigo-300 hover:text-white transition-colors"
                >
                  View
                </a>
              )}
            </div>
          );
        }

        // Detect brand & get configs
        const brand = detectBrand(title, icon);
        const btnConfig = getButtonConfig(brand, comp.componentType);
        const iconContainerClass = getIconContainerClass(brand);
        const isFeatured = comp.componentType === "FEATURED_LINK";
        const currentIndex = cardIndex++;

        // UNIFIED PREMIUM CARD
        return (
          <a
            key={comp.id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick(linkId)}
            className={`group relative block rounded-2xl animate-fade-in-up ${
              isFeatured
                ? "p-[1.5px] featured-card-border shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/25"
                : "glass-card glass-card-interactive"
            }`}
            style={{
              animationDelay: `${currentIndex * 60}ms`,
              ...(isFeatured
                ? {
                    backgroundImage: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899, #6366f1)",
                    backgroundSize: "300% 300%",
                  }
                : {}),
            }}
          >
            <div
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl min-h-[56px] ${
                isFeatured
                  ? "bg-slate-950/[0.93] backdrop-blur-[60px]"
                  : ""
              }`}
            >
              {/* Left: Icon Container + Text */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Brand-tinted icon container */}
                <div className={`${iconContainerClass} group-hover:scale-[1.06]`}>
                  <DynamicIcon name={icon} className="w-[28px] h-[28px]" size={28} />
                </div>

                {/* Title & Description */}
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-[15px] text-white tracking-tight truncate group-hover:text-indigo-200 transition-colors duration-200">
                      {title}
                    </span>
                    {badge && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-[2px] rounded-md bg-indigo-500/15 text-indigo-300/80 border border-indigo-500/20 flex-shrink-0 tracking-wide">
                        {badge}
                      </span>
                    )}
                  </div>
                  {description && (
                    <p className="text-[12px] text-slate-400 line-clamp-1 leading-snug">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Action Pill Button */}
              <div className="ml-3 flex-shrink-0">
                <div
                  className={`flex items-center gap-1 px-3.5 py-[6px] rounded-xl border text-[11px] font-bold tracking-wide transition-all duration-200 active:scale-95 ${btnConfig.classes}`}
                >
                  <span>{btnConfig.label}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}