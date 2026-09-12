import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    return NextResponse.json({ settings: settings || {} });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        ...body,
      },
      update: {
        ...(body.brandName !== undefined && { brandName: body.brandName }),
        ...(body.username !== undefined && { username: body.username }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
        ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
        ...(body.accentColor !== undefined && { accentColor: body.accentColor }),
        ...(body.footerText !== undefined && { footerText: body.footerText }),
        ...(body.announcementActive !== undefined && { announcementActive: body.announcementActive }),
        ...(body.announcementText !== undefined && { announcementText: body.announcementText }),
        ...(body.announcementUrl !== undefined && { announcementUrl: body.announcementUrl }),
        ...(body.announcementIcon !== undefined && { announcementIcon: body.announcementIcon }),
        ...(body.seoTitle !== undefined && { seoTitle: body.seoTitle }),
        ...(body.seoDescription !== undefined && { seoDescription: body.seoDescription }),
        ...(body.ogImage !== undefined && { ogImage: body.ogImage }),
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
