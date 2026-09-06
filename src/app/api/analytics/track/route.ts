import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function parseDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

function parseReferrer(rawReferrer: string): string {
  if (!rawReferrer || rawReferrer === "direct" || rawReferrer === "Direct") {
    return "Direct";
  }
  try {
    const url = new URL(rawReferrer);
    const host = url.hostname.toLowerCase();
    if (host.includes("tiktok")) return "TikTok";
    if (host.includes("youtube") || host.includes("youtu.be")) return "YouTube";
    if (host.includes("facebook") || host.includes("fb.me")) return "Facebook";
    if (host.includes("instagram")) return "Instagram";
    if (host.includes("t.me") || host.includes("telegram")) return "Telegram";
    if (host.includes("whatsapp") || host.includes("wa.me")) return "WhatsApp";
    if (host.includes("twitter") || host.includes("x.com")) return "X / Twitter";
    if (host.includes("discord")) return "Discord";
    if (host.includes("google")) return "Google Search";
    return host.replace(/^www\./, "");
  } catch {
    return "Direct";
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, pageId, linkId, utmSource, utmMedium, utmCampaign } = body;

    const userAgent = request.headers.get("user-agent") || "";
    const headerReferrer = request.headers.get("referer") || "";
    const referrer = parseReferrer(utmSource ? utmSource : headerReferrer);
    const deviceType = parseDevice(userAgent);

    if (eventType === "PAGE_VIEW" && pageId) {
      // Record analytics event
      await prisma.analyticsEvent.create({
        data: {
          eventType: "PAGE_VIEW",
          pageId,
          referrer,
          utmSource: utmSource || "",
          utmMedium: utmMedium || "",
          utmCampaign: utmCampaign || "",
          deviceType,
        },
      });

      // Increment page view count
      await prisma.page.update({
        where: { id: pageId },
        data: { viewsCount: { increment: 1 } },
      });

      return NextResponse.json({ success: true, tracked: "PAGE_VIEW" });
    }

    if (eventType === "LINK_CLICK" && linkId) {
      await prisma.analyticsEvent.create({
        data: {
          eventType: "LINK_CLICK",
          linkId,
          pageId: pageId || null,
          referrer,
          deviceType,
        },
      });

      // Increment link click count
      await prisma.link.update({
        where: { id: linkId },
        data: { clickCount: { increment: 1 } },
      });

      return NextResponse.json({ success: true, tracked: "LINK_CLICK" });
    }

    return NextResponse.json({ success: false, message: "No trackable parameters" });
  } catch (error) {
    console.error("Analytics track error:", error);
    // Don't fail client navigation on analytics error
    return NextResponse.json({ error: "Failed to record analytics" }, { status: 200 });
  }
}