import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  try {
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        components: {
          orderBy: { position: "asc" },
          include: { link: true },
        },
      },
    });
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
    return NextResponse.json({ page });
  } catch (error) {
    console.error("Page fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  try {
    const body = await request.json();

    // If setting as main, unset any existing main page first
    if (body.isMain === true) {
      await prisma.page.updateMany({ where: { isMain: true }, data: { isMain: false } });
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.isMain !== undefined && { isMain: body.isMain }),
        ...(body.seoTitle !== undefined && { seoTitle: body.seoTitle }),
        ...(body.seoDescription !== undefined && { seoDescription: body.seoDescription }),
        ...(body.ogImage !== undefined && { ogImage: body.ogImage }),
      },
    });
    return NextResponse.json({ page });
  } catch (error) {
    console.error("Page update error:", error);
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  try {
    // Prevent deleting the main page
    const page = await prisma.page.findUnique({ where: { id } });
    if (page?.isMain) {
      return NextResponse.json(
        { error: "Cannot delete the main page. Set another page as main first." },
        { status: 400 }
      );
    }

    await prisma.page.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Page delete error:", error);
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
