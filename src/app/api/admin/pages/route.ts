import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";
import { validateSlug } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { components: true } },
      },
    });
    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Pages fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await authenticateAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, slug, title, description, isMain, seoTitle, seoDescription } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required." }, { status: 400 });
    }

    const validation = validateSlug(slug);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await prisma.page.findUnique({ where: { slug: validation.cleanedSlug } });
    if (existing) {
      return NextResponse.json({ error: `Slug "${validation.cleanedSlug}" is already in use.` }, { status: 409 });
    }

    // If setting as main, unset any existing main page
    if (isMain) {
      await prisma.page.updateMany({ where: { isMain: true }, data: { isMain: false } });
    }

    const page = await prisma.page.create({
      data: {
        name,
        slug: validation.cleanedSlug!,
        title: title || "",
        description: description || "",
        isMain: isMain || false,
        isActive: true,
        seoTitle: seoTitle || "",
        seoDescription: seoDescription || "",
      },
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    console.error("Page create error:", error);
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
