import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";
import { sanitizeUrl } from "@/lib/validation";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const link = await prisma.link.findUnique({
    where: { id },
    include: {
      _count: {
        select: { pageComponents: true },
      },
      pageComponents: {
        include: {
          page: {
            select: { id: true, name: true, slug: true, isMain: true },
          },
        },
      },
    },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.json({ link });
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
    const data = await request.json();
    const { title, url, description, icon, type, category, badge, isActive, order } = data;

    const existing = await prisma.link.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const updated = await prisma.link.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(url !== undefined && { url: sanitizeUrl(url) }),
        ...(description !== undefined && { description: description.trim() }),
        ...(icon !== undefined && { icon }),
        ...(type !== undefined && { type }),
        ...(category !== undefined && { category }),
        ...(badge !== undefined && { badge: badge.trim() }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(order !== undefined && { order: Number(order) }),
      },
      include: {
        _count: {
          select: { pageComponents: true },
        },
      },
    });

    return NextResponse.json({ link: updated });
  } catch (error) {
    console.error("Update link error:", error);
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
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

    // Delete or detach link components
    await prisma.pageComponent.deleteMany({
      where: { linkId: id },
    });

    await prisma.link.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Link deleted successfully" });
  } catch (error) {
    console.error("Delete link error:", error);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}