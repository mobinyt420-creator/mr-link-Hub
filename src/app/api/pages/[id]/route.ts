import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";
import { validateSlug } from "@/lib/validation";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const page = await prisma.page.findUnique({
    where: { id },
    include: {
      components: {
        orderBy: { position: "asc" },
        include: {
          link: true,
        },
      },
      _count: {
        select: { analytics: true },
      },
    },
  });

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json({ page });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const {
      name,
      slug,
      title,
      description,
      isActive,
      seoTitle,
      seoDescription,
      ogImage,
      components,
    } = body;

    const existing = await prisma.page.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Slug validation if changed and not main page
    let finalSlug = existing.slug;
    if (slug !== undefined && !existing.isMain && slug !== existing.slug) {
      const validation = validateSlug(slug);
      if (!validation.valid || !validation.cleanedSlug) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const slugTaken = await prisma.page.findFirst({
        where: { slug: validation.cleanedSlug, id: { not: id } },
      });
      if (slugTaken) {
        return NextResponse.json({ error: "Slug already in use." }, { status: 400 });
      }
      finalSlug = validation.cleanedSlug;
    }

    // Execute in transaction: update page details + sync components
    const updatedPage = await prisma.$transaction(async (tx) => {
      // 1. Update page
      const page = await tx.page.update({
        where: { id },
        data: {
          ...(name !== undefined && { name: name.trim() }),
          slug: finalSlug,
          ...(title !== undefined && { title: title.trim() }),
          ...(description !== undefined && { description: description.trim() }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
          ...(seoTitle !== undefined && { seoTitle: seoTitle.trim() }),
          ...(seoDescription !== undefined && { seoDescription: seoDescription.trim() }),
          ...(ogImage !== undefined && { ogImage: ogImage.trim() }),
        },
      });

      // 2. Sync components if provided
      if (Array.isArray(components)) {
        // Remove existing components
        await tx.pageComponent.deleteMany({ where: { pageId: id } });

        // Insert new components with positions
        for (let i = 0; i < components.length; i++) {
          const comp = components[i];
          await tx.pageComponent.create({
            data: {
              pageId: id,
              position: i,
              componentType: comp.componentType || "LINK_CARD",
              linkId: comp.linkId || null,
              customTitle: comp.customTitle ? comp.customTitle.trim() : null,
              customDescription: comp.customDescription ? comp.customDescription.trim() : null,
              customBadge: comp.customBadge ? comp.customBadge.trim() : null,
              headingText: comp.headingText ? comp.headingText.trim() : null,
              announcementText: comp.announcementText ? comp.announcementText.trim() : null,
              announcementUrl: comp.announcementUrl ? comp.announcementUrl.trim() : null,
              isVisible: comp.isVisible !== false,
            },
          });
        }
      }

      return page;
    });

    // Return updated with full relations
    const fullPage = await prisma.page.findUnique({
      where: { id },
      include: {
        components: {
          orderBy: { position: "asc" },
          include: { link: true },
        },
      },
    });

    return NextResponse.json({ page: fullPage });
  } catch (error) {
    console.error("Update page error:", error);
    return NextResponse.json({ error: "Failed to update page." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const page = await prisma.page.findUnique({ where: { id } });

    if (!page) {
      return NextResponse.json({ error: "Page not found." }, { status: 404 });
    }

    if (page.isMain) {
      return NextResponse.json(
        { error: "The permanent Main Website cannot be deleted." },
        { status: 400 }
      );
    }

    await prisma.page.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Page deleted successfully." });
  } catch (error) {
    console.error("Delete page error:", error);
    return NextResponse.json({ error: "Failed to delete page." }, { status: 500 });
  }
}