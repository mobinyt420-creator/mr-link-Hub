import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import GatewayClient from "./GatewayClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;

  let shortLink = null;
  let article = null;

  try {
    shortLink = await prisma.shortLink.findUnique({ where: { code } });
    if (shortLink) {
      const count = await prisma.article.count({ where: { isPublished: true } });
      const skip = Math.floor(Math.random() * count);
      article = await prisma.article.findFirst({
        where: { isPublished: true },
        skip,
      });
    }
  } catch {
    // DB fallback
  }

  if (!shortLink || !shortLink.isActive) {
    return { title: "Link Not Found — LinkHub SafeLink" };
  }

  return {
    title: `${article?.title || "Secure Download"} — LinkHub SafeLink`,
    description: article?.excerpt || "Read the latest tech insights, guides, and download your verified file.",
  };
}

export default async function GatewayPage({ params }: PageProps) {
  const { code } = await params;

  let shortLink = null;
  let mainArticle = null;
  let moreArticles: Array<{
    id: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    readTime: number;
    coverImage: string;
    slug: string;
  }> = [];

  try {
    shortLink = await prisma.shortLink.findUnique({ where: { code } });

    if (shortLink && shortLink.isActive) {
      // Fetch 6 published articles
      const allArticles = await prisma.article.findMany({
        where: { isPublished: true },
        take: 8,
        orderBy: { createdAt: "desc" },
      });

      if (allArticles.length > 0) {
        mainArticle = allArticles[0];
        moreArticles = allArticles.slice(1).map((a) => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt,
          category: a.category,
          author: a.author,
          readTime: a.readTime,
          coverImage: a.coverImage,
          slug: a.slug,
        }));
      }
    }
  } catch {
    // DB error fallback
  }

  if (!shortLink || !shortLink.isActive) {
    notFound();
  }

  return (
    <GatewayClient
      shortCode={code}
      shortLinkId={shortLink.id}
      targetUrl={shortLink.targetUrl}
      linkTitle={shortLink.title}
      article={
        mainArticle
          ? {
              id: mainArticle.id,
              title: mainArticle.title,
              content: mainArticle.content,
              category: mainArticle.category,
              author: mainArticle.author,
              readTime: mainArticle.readTime,
              coverImage: mainArticle.coverImage,
            }
          : null
      }
      moreArticles={moreArticles}
    />
  );
}
