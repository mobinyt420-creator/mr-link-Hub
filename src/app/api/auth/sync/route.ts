import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, email, displayName, photoURL, username } = body;

    if (!uid || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check or create admin / creator user in DB
    const existing = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!existing) {
      await prisma.adminUser.create({
        data: {
          id: uid,
          email,
          name: displayName || "Creator",
          passwordHash: "FIREBASE_OAUTH_USER",
        },
      });
    }

    // Check if Page exists for this user's username
    const pageSlug = username || "creator";
    const existingPage = await prisma.page.findUnique({
      where: { slug: pageSlug },
    });

    if (!existingPage) {
      await prisma.page.create({
        data: {
          name: displayName || "My Links",
          slug: pageSlug,
          title: displayName || "Official Hub",
          description: "Digital Creator • Links & Top-ups",
          isActive: true,
          isMain: false,
        },
      });
    }

    return NextResponse.json({ success: true, username: pageSlug });
  } catch (error: any) {
    console.error("Auth Sync Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
