import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { RESERVED_SLUGS } from "@/lib/validation";
import BackgroundGlow from "@/components/public/BackgroundGlow";
import ProfileHeader from "@/components/public/ProfileHeader";
import ComponentRenderer from "@/components/public/ComponentRenderer";
import PublicFooter from "@/components/public/PublicFooter";
import AnalyticsTracker from "@/components/public/AnalyticsTracker";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug.toLowerCase())) {
    return { title: "Page Not Found" };
  }

  let settings = null;
  let page = null;

  try {
    [settings, page] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "default" } }).catch(() => null),
      prisma.page.findUnique({ where: { slug: slug.toLowerCase() } }).catch(() => null),
    ]);
  } catch {
    // Ignore error
  }

  if (!page || !page.isActive) {
    return { title: "Page Not Found" };
  }

  const title = page.seoTitle || `${page.name} — ${settings?.brandName || "Mobin X"}`;
  const description = page.seoDescription || page.description || settings?.seoDescription || "";
  const ogImage = page.ogImage || settings?.ogImage || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DynamicExtraPage({ params }: PageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  if (RESERVED_SLUGS.has(normalizedSlug)) {
    notFound();
  }

  let settings = null;
  let page = null;

  try {
    [settings, page] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "default" } }).catch(() => null),
      prisma.page.findUnique({
        where: { slug: normalizedSlug },
        include: {
          components: {
            orderBy: { position: "asc" },
            include: { link: true },
          },
        },
      }).catch(() => null),
    ]);
  } catch {
    // Catch db query failure
  }

  if (!page || !page.isActive) {
    notFound();
  }

  const brandName = settings?.brandName || "Mobin X";
  const username = settings?.username || "@mobinx";
  const avatarUrl = settings?.avatarUrl || "";
  const accentColor = settings?.accentColor || "#6366f1";

  // Filter out invisible components or inactive links before sending to client
  const activeComponents = (page.components || []).filter(
    (c) => c.isVisible && (!c.link || c.link.isActive)
  );

  return (
    <main className="min-h-screen flex flex-col relative selection:bg-indigo-500 selection:text-white noise-overlay">
      <BackgroundGlow accentColor={accentColor} />
      <AnalyticsTracker pageId={page.id} />

      <ProfileHeader
        brandName={brandName}
        username={username}
        bio={settings?.bio || ""}
        avatarUrl={avatarUrl}
        isExtraPage={true}
        pageTitle={page.title || page.name}
        pageDescription={page.description}
        accentColor={accentColor}
      />

      <div className="flex-1 w-full max-w-lg mx-auto">
        <ComponentRenderer
          components={activeComponents}
          pageId={page.id}
          accentColor={accentColor}
        />
      </div>

      <PublicFooter
        footerText={settings?.footerText}
        brandName={brandName}
      />
    </main>
  );
}