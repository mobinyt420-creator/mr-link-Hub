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
    // DB error fallback
  }

  if (!shortLink || !shortLink.isActive) {
    return { title: "Link Not Found — LinkHub" };
  }

  return {
    title: article?.title || "LinkHub — Premium Content",
    description: article?.excerpt || "Read the latest insights on technology, programming, and digital innovation.",
  };
}

export default async function GatewayPage({ params }: PageProps) {
  const { code } = await params;

  let shortLink = null;
  let article = null;

  try {
    shortLink = await prisma.shortLink.findUnique({ where: { code } });

    if (shortLink && shortLink.isActive) {
      const count = await prisma.article.count({ where: { isPublished: true } });
      const skip = Math.floor(Math.random() * count);
      article = await prisma.article.findFirst({
        where: { isPublished: true },
        skip,
      });
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
        article
          ? {
              id: article.id,
              title: article.title,
              content: article.content,
              category: article.category,
              author: article.author,
              readTime: article.readTime,
              coverImage: article.coverImage,
            }
          : null
      }
    />
  );
}
