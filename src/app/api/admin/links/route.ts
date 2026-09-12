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

    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required." }, { status: 400 });
    }

    const count = await prisma.link.count();

    const link = await prisma.link.create({
      data: {
        title,
        description: description || "",
        url,
        icon: icon || "ExternalLink",
        type: type || "standard",
        category: category || "Service",
        badge: badge || "",
        isActive: isActive !== false,
        order: order !== undefined ? order : count,
      },
    });

    // Auto-attach to active bio page so it displays immediately on the public page
    try {
      const defaultPage = await prisma.page.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      });

      if (defaultPage) {
        const compCount = await prisma.pageComponent.count({
          where: { pageId: defaultPage.id },
        });

        const componentType =
          type === "featured"
            ? "FEATURED_LINK"
            : type === "download"
            ? "DOWNLOAD_LINK"
            : type === "social"
            ? "SOCIAL_LINK"
            : "LINK_CARD";

        await prisma.pageComponent.create({
          data: {
            pageId: defaultPage.id,
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
  } catch (error) {
    console.error("Link create error:", error);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}
