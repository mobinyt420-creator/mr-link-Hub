import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import SiteHeader from "@/components/SiteHeader";
import { BookOpen, Clock, ArrowRight, User, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles — LinkHub | Tech, Programming & Digital Innovation",
  description:
    "Explore in-depth articles on AI, cybersecurity, web development, cloud computing, and more. Free knowledge for developers and tech enthusiasts.",
};

export default async function ArticlesPage() {
  let articles: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    coverImage: string;
    author: string;
    readTime: number;
    createdAt: Date;
  }> = [];

  try {
    articles = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        coverImage: true,
        author: true,
        readTime: true,
        createdAt: true,
      },
    });
  } catch {
    // DB read error
  }

  // Group by categories
  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100">
      <SiteHeader currentPath="/articles" />

      {/* Hero section */}
      <div className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-[-40%] left-[20%] w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
              Knowledge Hub
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Tech Articles & Insights
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
            Stay updated with the latest in technology, programming, cybersecurity,
            and digital innovation. Free, high-quality content for developers
            and tech enthusiasts.
          </p>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-slate-300 hover:bg-indigo-500/10 hover:border-indigo-500/20 hover:text-indigo-300 transition-all cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Articles grid */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article, idx) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group glass-card glass-card-interactive rounded-xl overflow-hidden flex flex-col"
                style={{
                  animationDelay: `${idx * 50}ms`,
                }}
              >
                {/* Cover image */}
                {article.coverImage && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm border border-white/[0.1] text-[10px] font-semibold text-indigo-300 uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col">
                  <h2 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2 flex-1">
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime} min</span>
                    </div>
                  </div>
                </div>

                {/* Read more bar */}
                <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center justify-between">
                  <span className="text-[11px] font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    Read Article
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} LinkHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">About Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
