import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shortLinkId, articleId, action } = body;

    if (!shortLinkId || typeof shortLinkId !== "string") {
      return NextResponse.json(
        { error: "shortLinkId is required." },
        { status: 400 }
      );
    }

    // Detect device info from user agent
    const ua = request.headers.get("user-agent") || "";
    let deviceType = "Desktop";
    if (/mobile/i.test(ua)) deviceType = "Mobile";
    else if (/tablet|ipad/i.test(ua)) deviceType = "Tablet";

    let browser = "Other";
    if (/chrome/i.test(ua) && !/edge/i.test(ua)) browser = "Chrome";
    else if (/firefox/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
    else if (/edge/i.test(ua)) browser = "Edge";

    // Create a simple IP hash for unique visitor tracking
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const ipHash = Buffer.from(ip).toString("base64").slice(0, 16);

    const referrer = request.headers.get("referer") || "Direct";

    if (action === "view") {
      // Register a gateway page view
      await prisma.gatewayView.create({
        data: {
          shortLinkId,
          articleId: articleId || null,
          ipHash,
          deviceType,
          browser,
          referrer,
          completed: false,
        },
      });

      return NextResponse.json({ success: true, type: "view" });
    }

    if (action === "click") {
      // Mark the view as completed and increment click count
      // Find the latest incomplete view from same IP
      const latestView = await prisma.gatewayView.findFirst({
        where: {
          shortLinkId,
          ipHash,
          completed: false,
        },
        orderBy: { timestamp: "desc" },
      });

      if (latestView) {
        await prisma.gatewayView.update({
          where: { id: latestView.id },
          data: { completed: true },
        });
      }

      // Check if this IP already clicked today (for unique click tracking)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingToday = await prisma.gatewayView.count({
        where: {
          shortLinkId,
          ipHash,
          completed: true,
          timestamp: { gte: today },
        },
      });

      const isUnique = existingToday <= 1; // <= 1 because we just updated

      // Update short link stats
      await prisma.shortLink.update({
        where: { id: shortLinkId },
        data: {
          clickCount: { increment: 1 },
          uniqueClicks: isUnique ? { increment: 1 } : undefined,
          // Estimated earnings: ~$0.002 per click (~0.24 BDT)
          earnings: isUnique ? { increment: 0.24 } : { increment: 0.05 },
        },
      });

      return NextResponse.json({ success: true, type: "click", isUnique });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'view' or 'click'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Shortener click error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
