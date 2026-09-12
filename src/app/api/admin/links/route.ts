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
        order: order || 0,
      },
    });

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("Link create error:", error);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}
