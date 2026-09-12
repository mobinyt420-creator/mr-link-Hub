import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import BackgroundGlow from "@/components/public/BackgroundGlow";
import ProfileHeader from "@/components/public/ProfileHeader";
import ComponentRenderer from "@/components/public/ComponentRenderer";
import PublicFooter from "@/components/public/PublicFooter";
import AnalyticsTracker from "@/components/public/AnalyticsTracker";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CreatorPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: CreatorPageProps): Promise<Metadata> {
  const { username } = await params;
  const normalizedUser = username.toLowerCase();

  let page = null;
  try {
    page = await prisma.page.findFirst({
      where: { slug: normalizedUser },
    });
  } catch {
    // ignore
  }

  const title = `${page?.name || normalizedUser} — LinkHub Official Bio`;
  const description = page?.description || `Check out ${normalizedUser}'s exclusive links, downloads, and social channels on LinkHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CreatorBioPage({ params }: CreatorPageProps) {
  const { username } = await params;
  const normalizedUser = username.toLowerCase();

  let page = null;
  let settings = null;

  try {
    [page, settings] = await Promise.all([
      prisma.page.findFirst({
        where: { slug: normalizedUser },
        include: {
          components: {
            orderBy: { position: "asc" },
            include: { link: true },
          },
        },
      }),
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
    ]);
  } catch {
    // db fallback
  }

  const displayName = page?.name || normalizedUser;
  const bio = page?.description || "Digital Creator & Tech Enthusiast";
  const accentColor = settings?.accentColor || "#6366f1";
  const avatarUrl = settings?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

  const activeComponents = (page?.components || []).filter(
    (c) => c.isVisible && (!c.link || c.link.isActive)
  );

  return (
    <main className="min-h-screen flex flex-col relative selection:bg-indigo-500 selection:text-white noise-overlay">
      <SiteHeader />
      <BackgroundGlow accentColor={accentColor} />
      {page && <AnalyticsTracker pageId={page.id} />}

      <ProfileHeader
        brandName={displayName}
        username={`@${normalizedUser}`}
        bio={bio}
        avatarUrl={avatarUrl}
        isExtraPage={false}
        pageTitle={displayName}
        pageDescription={bio}
        accentColor={accentColor}
      />

      <div className="flex-1 w-full max-w-lg mx-auto px-4 pb-12">
        {activeComponents.length > 0 ? (
          <ComponentRenderer
            components={activeComponents}
            pageId={page?.id || "creator-page"}
            accentColor={accentColor}
          />
        ) : (
          <div className="text-center py-12 glass-card rounded-2xl p-6 border border-white/[0.06]">
            <p className="text-sm text-slate-300 font-semibold mb-1">
              {displayName} এর লিঙ্ক পেজ রেডি হচ্ছে!
            </p>
            <p className="text-xs text-slate-500">
              খুব শীঘ্রই নতুন লিঙ্ক ও সার্ভিস যুক্ত করা হবে।
            </p>
          </div>
        )}
      </div>

      <PublicFooter
        footerText={`© ${new Date().getFullYear()} ${displayName}. Powered by LinkHub.`}
        brandName={displayName}
      />
    </main>
  );
}
