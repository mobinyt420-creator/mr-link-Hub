import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";
import { sanitizeUrl } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where: any = {};
  if (category && category !== "All") {
    where.category = category;
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { url: { contains: search } },
    ];
  }

  const links = await prisma.link.findMany({
    where,
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { pageComponents: true },
      },
    },
  });

  return NextResponse.json({ links });
}

export async function POST(request: NextRequest) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { title, url, description, icon, type, category, badge, isActive } = data;

    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required." }, { status: 400 });
    }

    const maxOrder = await prisma.link.aggregate({
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? 0) + 1;

    const newLink = await prisma.link.create({
      data: {
        title: title.trim(),
        url: sanitizeUrl(url),
        description: description ? description.trim() : "",
        icon: icon || "ExternalLink",
        type: type || "standard",
        category: category || "Service",
        badge: badge ? badge.trim() : "",
        isActive: isActive !== false,
        order: nextOrder,
      },
      include: {
        _count: {
          select: { pageComponents: true },
        },
      },
    });

    return NextResponse.json({ link: newLink }, { status: 201 });
  } catch (error) {
    console.error("Create link error:", error);
    return NextResponse.json({ error: "Failed to create link." }, { status: 500 });
  }
}