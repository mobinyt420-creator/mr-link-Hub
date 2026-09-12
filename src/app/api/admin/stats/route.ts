import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalLinks,
      activeLinks,
      totalPages,
      activePages,
      totalViews,
      totalClicks,
      recentViews,
      recentClicks,
      topLinks,
      topPages,
    ] = await Promise.all([
      prisma.link.count(),
      prisma.link.count({ where: { isActive: true } }),
      prisma.page.count(),
      prisma.page.count({ where: { isActive: true } }),
      prisma.analyticsEvent.count({ where: { eventType: "PAGE_VIEW" } }),
      prisma.analyticsEvent.count({ where: { eventType: "LINK_CLICK" } }),
      prisma.analyticsEvent.count({
        where: { eventType: "PAGE_VIEW", timestamp: { gte: last7Days } },
      }),
      prisma.analyticsEvent.count({
        where: { eventType: "LINK_CLICK", timestamp: { gte: last7Days } },
      }),
      prisma.link.findMany({
        orderBy: { clickCount: "desc" },
        take: 5,
        select: { id: true, title: true, clickCount: true, icon: true },
      }),
      prisma.page.findMany({
        orderBy: { viewsCount: "desc" },
        take: 5,
        select: { id: true, name: true, slug: true, viewsCount: true, isMain: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalLinks,
        activeLinks,
        totalPages,
        activePages,
        totalViews,
        totalClicks,
        recentViews,
        recentClicks,
        topLinks,
        topPages,
      },
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
