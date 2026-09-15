import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const links = await prisma.link.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { pageComponents: true } } },
    });
    return NextResponse.json({ links });
  } catch (error) {
    console.error("Links fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, url, icon, type, category, badge, isActive, order } = body;

    if (!title?.trim() || !url?.trim()) {
      return NextResponse.json({ error: "Title and URL are required." }, { status: 400 });
    }

    // Sanitize URL
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl) && !/^(mailto|tel):/i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const count = await prisma.link.count();

    const link = await prisma.link.create({
      data: {
        title: title.trim(),
        description: (description || "").trim(),
        url: formattedUrl,
        icon: icon || "ExternalLink",
        type: type || "standard",
        category: category || "Service",
        badge: (badge || "").trim(),
        isActive: isActive !== false,
        order: order !== undefined ? order : count,
      },
    });

    // Auto-attach to active bio page so it displays immediately on the public page
    try {
      const activePages = await prisma.page.findMany({
        where: { isActive: true },
      });

      const componentType =
        type === "featured"
          ? "FEATURED_LINK"
          : type === "download"
          ? "DOWNLOAD_LINK"
          : type === "social"
          ? "SOCIAL_LINK"
          : "LINK_CARD";

      for (const page of activePages) {
        const compCount = await prisma.pageComponent.count({
          where: { pageId: page.id },
        });

        await prisma.pageComponent.create({
          data: {
            pageId: page.id,
            linkId: link.id,
            componentType,
            position: compCount,
            isVisible: true,
          },
        });
      }
    } catch (attachErr) {
      console.warn("Auto page-component attach notice:", attachErr);
    }

    return NextResponse.json({ link }, { status: 201 });
  } catch (error: any) {
    console.error("Link create error:", error);
    return NextResponse.json({ error: error.message || "Failed to create link" }, { status: 500 });
  }
}
