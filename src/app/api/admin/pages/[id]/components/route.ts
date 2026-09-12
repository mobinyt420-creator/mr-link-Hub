import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: pageId } = await context.params;

  try {
    const body = await request.json();
    const { components } = body;

    if (!Array.isArray(components)) {
      return NextResponse.json({ error: "Components array is required." }, { status: 400 });
    }

    // Delete existing components for this page and recreate
    await prisma.pageComponent.deleteMany({ where: { pageId } });

    // Create new components in order
    for (let i = 0; i < components.length; i++) {
      const comp = components[i];
      await prisma.pageComponent.create({
        data: {
          pageId,
          componentType: comp.componentType || "LINK_CARD",
          linkId: comp.linkId || null,
          position: i,
          headingText: comp.headingText || null,
          announcementText: comp.announcementText || null,
          announcementUrl: comp.announcementUrl || null,
          customTitle: comp.customTitle || null,
          customDescription: comp.customDescription || null,
          customBadge: comp.customBadge || null,
          isVisible: comp.isVisible !== false,
        },
      });
    }

    // Return updated page with components
    const updatedPage = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        components: {
          orderBy: { position: "asc" },
          include: { link: true },
        },
      },
    });

    return NextResponse.json({ page: updatedPage });
  } catch (error) {
    console.error("Components update error:", error);
    return NextResponse.json({ error: "Failed to update components" }, { status: 500 });
  }
}
