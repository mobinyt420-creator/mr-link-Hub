import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";
import { validateSlug } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { slug: { contains: search } },
      { title: { contains: search } },
    ];
  }

  const pages = await prisma.page.findMany({
    where,
    orderBy: [{ isMain: "desc" }, { createdAt: "desc" }],
    include: {
      _count: {
        select: {
          components: true,
          analytics: true,
        },
      },
      components: {
        where: { isVisible: true },
        select: { id: true },
      },
    },
  });

  return NextResponse.json({ pages });
}

export async function POST(request: NextRequest) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { name, slug, title, description, isActive, seoTitle, seoDescription, ogImage } = data;

    if (!name) {
      return NextResponse.json({ error: "Page name is required." }, { status: 400 });
    }

    const validation = validateSlug(slug);
    if (!validation.valid || !validation.cleanedSlug) {
      return NextResponse.json({ error: validation.error || "Invalid slug." }, { status: 400 });
    }

    // Check slug collision
    const existing = await prisma.page.findUnique({
      where: { slug: validation.cleanedSlug },
    });
    if (existing) {
      return NextResponse.json({ error: "A page with this slug already exists. Please choose a different slug." }, { status: 400 });
    }

    const page = await prisma.page.create({
      data: {
        name: name.trim(),
        slug: validation.cleanedSlug,
        isMain: false,
        title: title ? title.trim() : name.trim(),
        description: description ? description.trim() : "",
        isActive: isActive !== false,
        seoTitle: seoTitle ? seoTitle.trim() : `${name.trim()} — Official Links`,
        seoDescription: seoDescription ? seoDescription.trim() : "",
        ogImage: ogImage ? ogImage.trim() : "",
      },
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    console.error("Create page error:", error);
    return NextResponse.json({ error: "Failed to create page." }, { status: 500 });
  }
}