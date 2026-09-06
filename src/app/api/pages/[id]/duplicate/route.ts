import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const original = await prisma.page.findUnique({
      where: { id },
      include: {
        components: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!original) {
      return NextResponse.json({ error: "Page to duplicate not found." }, { status: 404 });
    }

    // Generate unique slug
    let baseSlug = `${original.slug}-copy`;
    if (original.isMain) {
      baseSlug = "main-site-copy";
    }

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.page.findUnique({ where: { slug: uniqueSlug } })) {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }

    // Create cloned page in transaction
    const clonedPage = await prisma.$transaction(async (tx) => {
      const newPage = await tx.page.create({
        data: {
          name: `${original.name} (Copy)`,
          slug: uniqueSlug,
          isMain: false,
          title: original.title,
          description: original.description,
          isActive: false, // Default to inactive until published
          seoTitle: original.seoTitle,
          seoDescription: original.seoDescription,
          ogImage: original.ogImage,
        },
      });

      for (const comp of original.components) {
        await tx.pageComponent.create({
          data: {
            pageId: newPage.id,
            linkId: comp.linkId,
            componentType: comp.componentType,
            position: comp.position,
            customTitle: comp.customTitle,
            customDescription: comp.customDescription,
            customBadge: comp.customBadge,
            headingText: comp.headingText,
            announcementText: comp.announcementText,
            announcementUrl: comp.announcementUrl,
            isVisible: comp.isVisible,
          },
        });
      }

      return newPage;
    });

    return NextResponse.json({ page: clonedPage }, { status: 201 });
  } catch (error) {
    console.error("Duplicate page error:", error);
    return NextResponse.json({ error: "Failed to duplicate page." }, { status: 500 });
  }
}