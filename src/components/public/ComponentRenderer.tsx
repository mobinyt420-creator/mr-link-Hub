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
  if (t.includes("facebook") || ic.includes("facebook")) return "facebook";
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

// ─── Action button — ALWAYS filled with brand color (mobile-first, no hover-only) ───
function getButtonConfig(brand: string) {
  switch (brand) {
    case "telegram":
      return {
        label: "Join",
        classes: "bg-[#229ED9] text-white border-[#229ED9] shadow-md shadow-[#229ED9]/25",
      };
    case "youtube":
      return {
        label: "Subscribe",
        classes: "bg-[#FF0000] text-white border-[#FF0000] shadow-md shadow-[#FF0000]/25",
      };
    case "whatsapp":
      return {
        label: "Chat",
        classes: "bg-[#25D366] text-white border-[#25D366] shadow-md shadow-[#25D366]/25",
      };
    case "facebook":
      return {
        label: "Follow",
        classes: "bg-[#1877F2] text-white border-[#1877F2] shadow-md shadow-[#1877F2]/25",
      };
    case "diamond":
      return {
        label: "Top Up",
        classes: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/30 shadow-md shadow-blue-500/25",
      };
    case "download":
      return {
        label: "Download",
        classes: "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/25",
      };
    default:
      return {
        label: "Open",
        classes: "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25",
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

  let cardIndex = 0;

  return (
    <div className="flex flex-col gap-3 w-full max-w-lg mx-auto px-4 pb-12">
      {visibleComponents.map((comp) => {
        const title = comp.customTitle || comp.link?.title || "";
        const url = comp.link?.url || "#";
        const icon = comp.link?.icon || "ExternalLink";
        const linkId = comp.link?.id;

        // SECTION HEADING — optional divider (admin can choose to add)
        if (comp.componentType === "SECTION_HEADING") {
          return (
            <div
              key={comp.id}
              className="pt-4 pb-1 animate-fade-in-up"
              style={{ animationDelay: `${cardIndex++ * 60}ms` }}
            >
              <div className="flex items-center gap-3">
                <h3 className="text-[10.5px] font-extrabold tracking-[0.16em] text-slate-500 uppercase whitespace-nowrap">
                  {comp.headingText || "Links"}
                </h3>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/12 via-indigo-500/10 to-transparent" />
              </div>
            </div>
          );
        }

        // IN-PAGE ANNOUNCEMENT
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

        // Skip if no link attached
        if (!comp.link) return null;

        // Detect brand & get configs
        const brand = detectBrand(title, icon);
        const btnConfig = getButtonConfig(brand);
        const iconContainerClass = getIconContainerClass(brand);
        const isFeatured = comp.componentType === "FEATURED_LINK";
        const currentIndex = cardIndex++;

        // CLEAN PREMIUM CARD — title only, no description, no badge
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
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl ${
                isFeatured
                  ? "bg-slate-950/[0.93] backdrop-blur-[60px]"
                  : ""
              }`}
            >
              {/* Left: Icon + Title only */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className={`${iconContainerClass} group-hover:scale-[1.06]`}>
                  <DynamicIcon name={icon} className="w-[28px] h-[28px]" size={28} />
                </div>
                <span className="font-bold text-[15px] text-white tracking-tight truncate group-hover:text-indigo-200 transition-colors duration-200">
                  {title}
                </span>
              </div>

              {/* Right: Always-colored brand action button — UNIFORM SIZE */}
              <div className="ml-3 flex-shrink-0">
                <div
                  className={`flex items-center justify-center gap-1 min-w-[90px] px-3 py-[7px] rounded-xl border text-[11px] font-bold tracking-wide transition-all duration-200 active:scale-95 ${btnConfig.classes}`}
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