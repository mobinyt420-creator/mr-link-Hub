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

    const cleanEmail = email.toLowerCase().trim();

    // Check if creator exists by email or uid
    let user = await prisma.adminUser.findFirst({
      where: {
        OR: [{ email: cleanEmail }, { id: uid }],
      },
    });

    if (!user) {
      try {
        user = await prisma.adminUser.create({
          data: {
            id: uid,
            email: cleanEmail,
            name: displayName || "Creator",
            passwordHash: "FIREBASE_OAUTH_USER",
          },
        });
      } catch {
        user = await prisma.adminUser.create({
          data: {
            email: cleanEmail,
            name: displayName || "Creator",
            passwordHash: "FIREBASE_OAUTH_USER",
          },
        });
      }
    }

    // Check if Bio Page exists for this user's username
    const pageSlug = (username || cleanEmail.split("@")[0] || "creator")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "")
      .slice(0, 30);

    try {
      const existingPage = await prisma.page.findUnique({
        where: { slug: pageSlug },
      });

      if (!existingPage) {
        await prisma.page.create({
          data: {
            name: displayName || "My Links",
            slug: pageSlug,
            title: displayName || "Official Hub",
            description: "Digital Creator • Personal Hub",
            isActive: true,
            isMain: false,
          },
        });
      }
    } catch (pageErr) {
      console.warn("Auto page check notice:", pageErr);
    }

    // Sign token and issue session cookie
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
