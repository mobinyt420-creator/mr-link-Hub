import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [shortLinks, totalClicks, totalEarnings, recentViews] =
      await Promise.all([
        prisma.shortLink.findMany({
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        prisma.shortLink.aggregate({
          _sum: { clickCount: true },
        }),
        prisma.shortLink.aggregate({
          _sum: { earnings: true },
        }),
        prisma.gatewayView.count({
          where: {
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

    return NextResponse.json({
      shortLinks: shortLinks.map((sl) => ({
        id: sl.id,
        code: sl.code,
        title: sl.title,
        targetUrl: sl.targetUrl,
        clickCount: sl.clickCount,
        uniqueClicks: sl.uniqueClicks,
        earnings: sl.earnings,
        isActive: sl.isActive,
        shortUrl: `/go/${sl.code}`,
        createdAt: sl.createdAt,
      })),
      stats: {
        totalLinks: shortLinks.length,
        totalClicks: totalClicks._sum.clickCount || 0,
        totalEarnings: totalEarnings._sum.earnings || 0,
        viewsLast24h: recentViews,
      },
    });
  } catch (error) {
    console.error("Shortener stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
