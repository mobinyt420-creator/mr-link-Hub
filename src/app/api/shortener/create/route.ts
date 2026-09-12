import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function generateCode(length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetUrl, title } = body;

    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json(
        { error: "Target URL is required." },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format. Must include https:// or http://" },
        { status: 400 }
      );
    }

    // Generate a unique code with collision check
    let code = generateCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.shortLink.findUnique({ where: { code } });
      if (!existing) break;
      code = generateCode();
      attempts++;
    }

    if (attempts >= 10) {
      return NextResponse.json(
        { error: "Failed to generate unique code. Please try again." },
        { status: 500 }
      );
    }

    const shortLink = await prisma.shortLink.create({
      data: {
        code,
        targetUrl,
        title: title || "",
      },
    });

    return NextResponse.json({
      success: true,
      shortLink: {
        id: shortLink.id,
        code: shortLink.code,
        targetUrl: shortLink.targetUrl,
        title: shortLink.title,
        shortUrl: `/go/${shortLink.code}`,
        createdAt: shortLink.createdAt,
      },
    });
  } catch (error) {
    console.error("Shortener create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
