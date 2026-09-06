import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Overall counts
  const totalPages = await prisma.page.count();
  const activePages = await prisma.page.count({ where: { isActive: true } });
  const totalLinks = await prisma.link.count();
  const activeLinks = await prisma.link.count({ where: { isActive: true } });

  // Sum of views across pages
  const viewsAggregation = await prisma.page.aggregate({
    _sum: { viewsCount: true },
  });
  const totalViews = viewsAggregation._sum.viewsCount || 0;

  // Sum of clicks across links
  const clicksAggregation = await prisma.link.aggregate({
    _sum: { clickCount: true },
  });
  const totalClicks = clicksAggregation._sum.clickCount || 0;

  // Click-through rate
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  // 2. Top Performing Pages
  const topPages = await prisma.page.findMany({
    orderBy: { viewsCount: "desc" },
    take: 6,
    select: {
      id: true,
      name: true,
      slug: true,
      isMain: true,
      viewsCount: true,
      isActive: true,
      _count: {
        select: { components: true },
      },
    },
  });

  // 3. Top Performing Links
  const topLinks = await prisma.link.findMany({
    orderBy: { clickCount: "desc" },
    take: 6,
    select: {
      id: true,
      title: true,
      url: true,
      icon: true,
      category: true,
      badge: true,
      clickCount: true,
      isActive: true,
      _count: {
        select: { pageComponents: true },
      },
    },
  });

  // 4. Referrers breakdown
  const referrerEvents = await prisma.analyticsEvent.groupBy({
    by: ["referrer"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 6,
  });

  // 5. Device breakdown
  const deviceEvents = await prisma.analyticsEvent.groupBy({
    by: ["deviceType"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  // 6. Recent activity log
  const recentEvents = await prisma.analyticsEvent.findMany({
    take: 12,
    orderBy: { timestamp: "desc" },
    include: {
      page: { select: { name: true, slug: true } },
      link: { select: { title: true, icon: true } },
    },
  });

  return NextResponse.json({
    summary: {
      totalPages,
      activePages,
      totalLinks,
      activeLinks,
      totalViews,
      totalClicks,
      ctr,
    },
    topPages,
    topLinks,
    referrers: referrerEvents.map((r) => ({ name: r.referrer, count: r._count.id })),
    devices: deviceEvents.map((d) => ({ name: d.deviceType, count: d._count.id })),
    recentEvents,
  });
}