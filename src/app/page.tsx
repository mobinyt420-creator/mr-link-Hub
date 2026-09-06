import React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import BackgroundGlow from "@/components/public/BackgroundGlow";
import ProfileHeader from "@/components/public/ProfileHeader";
import Announcement from "@/components/public/Announcement";
import ComponentRenderer, { RenderableComponent } from "@/components/public/ComponentRenderer";
import PublicFooter from "@/components/public/PublicFooter";
import AnalyticsTracker from "@/components/public/AnalyticsTracker";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// High-converting fallback data
const DEFAULT_FALLBACK_COMPONENTS: RenderableComponent[] = [
  {
    id: "f-1",
    componentType: "SECTION_HEADING",
    position: 0,
    headingText: "🔥 Top-Up & VIP Services",
    isVisible: true,
  },
  {
    id: "f-2",
    componentType: "FEATURED_LINK",
    position: 1,
    isVisible: true,
    link: {
      id: "l-1",
      title: "Free Fire Top Up",
      description: "Instant UID Diamond Delivery • 24/7 Automated",
      url: "https://example.com/topup",
      icon: "Diamond",
      type: "featured",
      category: "Service",
      badge: "INSTANT",
      isActive: true,
    },
  },
  {
    id: "f-3",
    componentType: "LINK_CARD",
    position: 2,
    isVisible: true,
    link: {
      id: "l-2",
      title: "VIP Proxy Server Nodes",
      description: "Singapore, Germany & US dedicated high-speed routes",
      url: "https://example.com/proxy-nodes",
      icon: "Server",
      type: "standard",
      category: "Service",
      badge: "LOW PING",
      isActive: true,
    },
  },
  {
    id: "f-4",
    componentType: "SECTION_HEADING",
    position: 3,
    headingText: "⚡ Fast Downloads",
    isVisible: true,
  },
  {
    id: "f-5",
    componentType: "DOWNLOAD_LINK",
    position: 4,
    isVisible: true,
    link: {
      id: "l-3",
      title: "Proxy Download (V2Ray / Clash)",
      description: "Direct APK & Config files for ultra-low ping gaming",
      url: "https://example.com/proxy-download",
      icon: "Download",
      type: "download",
      category: "Download",
      badge: "v4.2.1",
      isActive: true,
    },
  },
  {
    id: "f-6",
    componentType: "SECTION_HEADING",
    position: 5,
    headingText: "🌐 Join Official Communities",
    isVisible: true,
  },
  {
    id: "f-7",
    componentType: "SOCIAL_LINK",
    position: 6,
    isVisible: true,
    link: {
      id: "l-4",
      title: "Telegram Channel",
      description: "@mobinx_official • Daily config & VIP community",
      url: "https://t.me/mobinx_official",
      icon: "Telegram",
      type: "social",
      category: "Social",
      badge: "JOIN VIP",
      isActive: true,
    },
  },
  {
    id: "f-8",
    componentType: "SOCIAL_LINK",
    position: 7,
    isVisible: true,
    link: {
      id: "l-5",
      title: "Official YouTube Channel",
      description: "Tutorials, Gameplay & Live Streams • Subscribe",
      url: "https://youtube.com/@mobinx",
      icon: "Youtube",
      type: "social",
      category: "Social",
      badge: "150K SUB",
      isActive: true,
    },
  },
  {
    id: "f-9",
    componentType: "SOCIAL_LINK",
    position: 8,
    isVisible: true,
    link: {
      id: "l-6",
      title: "WhatsApp Official Channel",
      description: "Instant announcements & discount codes directly to your chat",
      url: "https://whatsapp.com/channel/example",
      icon: "WhatsApp",
      type: "social",
      category: "Social",
      badge: "UPDATES",
      isActive: true,
    },
  },
];

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  let mainPage = null;

  try {
    [settings, mainPage] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "default" } }).catch(() => null),
      prisma.page.findFirst({ where: { isMain: true } }).catch(() => null),
    ]);
  } catch {
    // Ignore db read error
  }

  const title = mainPage?.seoTitle || settings?.seoTitle || `${settings?.brandName || "Mobin X"} — Official Hub`;
  const description =
    mainPage?.seoDescription ||
    settings?.seoDescription ||
    "Official digital hub of Mobin X. Access fast top ups, proxy servers, download links, tutorials, and social channels.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: settings?.ogImage ? [{ url: settings.ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function MainPage() {
  let settings = null;
  let mainPage = null;

  try {
    [settings, mainPage] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "default" } }).catch(() => null),
      prisma.page.findFirst({
        where: { isMain: true },
        include: {
          components: {
            orderBy: { position: "asc" },
            include: { link: true },
          },
        },
      }).catch(() => null),
    ]);
  } catch {
    // Fallback gracefully if database initialization error occurs
  }

  const brandName = settings?.brandName || "Mobin X";
  const username = settings?.username || "@mobinx";
  const bio = settings?.bio || "Digital Creator • Tech Specialist • Gamer\nOfficial destination for premium gaming services, verified proxy servers & exclusive downloads.";
  const avatarUrl = settings?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";
  const accentColor = settings?.accentColor || "#6366f1";

  // Filter active components or use robust defaults
  const dbComponents = (mainPage?.components || []).filter(
    (c) => c.isVisible && (!c.link || c.link.isActive)
  );
  const activeComponents = dbComponents.length > 0 ? dbComponents : DEFAULT_FALLBACK_COMPONENTS;

  const announcementActive = settings?.announcementActive ?? true;
  const announcementText = settings?.announcementText || "🔥 Free Fire Top Up (Instant Delivery) & New Proxy Servers Online!";
  const announcementUrl = settings?.announcementUrl || "https://example.com/topup";
  const announcementIcon = settings?.announcementIcon || "Flame";

  return (
    <main className="min-h-screen flex flex-col relative selection:bg-indigo-500 selection:text-white">
      <BackgroundGlow accentColor={accentColor} />
      <AnalyticsTracker pageId={mainPage?.id || "main"} />

      <ProfileHeader
        brandName={brandName}
        username={username}
        bio={bio}
        avatarUrl={avatarUrl}
        accentColor={accentColor}
      />

      {announcementActive && (
        <Announcement
          text={announcementText}
          url={announcementUrl}
          icon={announcementIcon}
        />
      )}

      <div className="flex-1 w-full max-w-lg mx-auto">
        <ComponentRenderer
          components={activeComponents}
          pageId={mainPage?.id || "main"}
          accentColor={accentColor}
        />
      </div>

      <PublicFooter
        footerText={settings?.footerText || "© 2026 Mobin X. All rights reserved. Built for speed & security."}
        brandName={brandName}
      />
    </main>
  );
}