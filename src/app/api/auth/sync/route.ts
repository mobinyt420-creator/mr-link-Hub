import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, email, displayName, photoURL, username } = body;

    if (!uid || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check or create admin / creator user in DB
    let user = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      user = await prisma.adminUser.create({
        data: {
          id: uid,
          email: email.toLowerCase().trim(),
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

    // Set secure auth cookie so user can immediately access /admin
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      username: pageSlug,
      user: { id: user.id, email: user.email, name: user.name },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Auth Sync Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
