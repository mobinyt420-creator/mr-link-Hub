import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import SiteHeader from "@/components/SiteHeader";
import {
  BookOpen,
  Clock,
  User,
  ArrowLeft,
  Eye,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let article = null;
  try {
    article = await prisma.article.findUnique({
      where: { slug },
      select: { title: true, excerpt: true, coverImage: true },
    });
  } catch {
    // DB error
  }

  if (!article) {
    return { title: "Article Not Found — LinkHub" };
  }

  return {
    title: `${article.title} — LinkHub`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [{ url: article.coverImage }] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let article = null;
  let relatedArticles: Array<{
    id: string;
    slug: string;
    title: string;
    category: string;
    readTime: number;
    coverImage: string;
  }> = [];

  try {
    article = await prisma.article.findUnique({ where: { slug } });

    if (article) {
      // Increment view count
      await prisma.article.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      });

      // Get related articles
      relatedArticles = await prisma.article.findMany({
        where: {
          isPublished: true,
          id: { not: article.id },
          category: article.category,
        },
        take: 3,
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
          readTime: true,
          coverImage: true,
        },
      });

      // If not enough related by category, fill with random
      if (relatedArticles.length < 3) {
        const more = await prisma.article.findMany({
          where: {
            isPublished: true,
            id: {
              notIn: [article.id, ...relatedArticles.map((a) => a.id)],
            },
          },
          take: 3 - relatedArticles.length,
          select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            readTime: true,
            coverImage: true,
          },
        });
        relatedArticles = [...relatedArticles, ...more];
      }
    }
  } catch {
    // DB error
  }

  if (!article || !article.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100">
      <SiteHeader currentPath="/articles" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-6">
          <Link href="/articles" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            Articles
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-400 truncate max-w-[200px]">{article.title}</span>
        </div>

        {/* Article header */}
        <div className="mb-6">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
            {article.category}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-4 mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            {article.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                <User className="w-3 h-3 text-indigo-300" />
              </div>
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{article.viewCount.toLocaleString()} views</span>
            </div>
          </div>
        </div>

        {/* Cover image */}
        {article.coverImage && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-white/[0.06]">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-56 sm:h-72 object-cover"
              loading="eager"
            />
          </div>
        )}

        {/* Ad slot: Top */}
        <div className="mb-8 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-widest mb-2">
            <Eye className="w-3 h-3" />
            Advertisement
          </div>
          <div className="h-[90px] rounded-lg bg-gradient-to-r from-slate-800/40 to-slate-700/30 flex items-center justify-center border border-white/[0.04]">
            <span className="text-xs text-slate-500">Google AdSense Banner — 728×90</span>
          </div>
        </div>

        {/* Article body */}
        <div
          className="article-content prose prose-invert max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
            prose-li:text-slate-300 prose-li:mb-1
            prose-strong:text-white prose-strong:font-semibold
            prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs
            prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
            prose-ul:mb-4 prose-ol:mb-4"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Ad slot: After content */}
        <div className="mt-10 mb-10 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-widest mb-2">
            <Eye className="w-3 h-3" />
            Advertisement
          </div>
          <div className="h-[250px] rounded-lg bg-gradient-to-br from-slate-800/40 to-slate-700/30 flex items-center justify-center border border-white/[0.04]">
            <span className="text-xs text-slate-500">Google AdSense — 300×250 Rectangle</span>
          </div>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-8 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Related Articles</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((ra) => (
                <Link
                  key={ra.id}
                  href={`/articles/${ra.slug}`}
                  className="glass-card glass-card-interactive rounded-xl overflow-hidden group"
                >
                  {ra.coverImage && (
                    <div className="h-28 overflow-hidden">
                      <img
                        src={ra.coverImage}
                        alt={ra.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <span className="text-[9px] font-semibold text-indigo-400 uppercase tracking-wider">
                      {ra.category}
                    </span>
                    <h3 className="text-xs font-bold text-white mt-1 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                      {ra.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{ra.readTime} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} LinkHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
