import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  try {
    const link = await prisma.link.findUnique({ where: { id } });
    if (!link) return NextResponse.json({ error: "Link not found" }, { status: 404 });
    return NextResponse.json({ link });
  } catch (error) {
    console.error("Link fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch link" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  try {
    const body = await request.json();
    let formattedUrl = body.url;
    if (body.url !== undefined && typeof body.url === "string") {
      formattedUrl = body.url.trim();
      if (!/^https?:\/\//i.test(formattedUrl) && !/^(mailto|tel):/i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
    }

    const link = await prisma.link.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.description !== undefined && { description: (body.description || "").trim() }),
        ...(formattedUrl !== undefined && { url: formattedUrl }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.badge !== undefined && { badge: (body.badge || "").trim() }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });
    return NextResponse.json({ link });
  } catch (error) {
    console.error("Link update error:", error);
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  try {
    await prisma.link.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Link delete error:", error);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
