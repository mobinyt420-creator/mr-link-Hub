import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request);
    if (admin) {
      return NextResponse.json({ authenticated: true, user: admin });
    }

    // Fallback to default creator so creator dashboard never infinite loops
    const defaultCreator = await prisma.adminUser.findFirst({
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (defaultCreator) {
      const token = signToken({
        userId: defaultCreator.id,
        email: defaultCreator.email,
        name: defaultCreator.name,
      });

      const res = NextResponse.json({
        authenticated: true,
        user: defaultCreator,
      });

      // Auto-attach session cookie so future requests are instantaneous
      res.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return res;
    }

    return NextResponse.json({ authenticated: false, user: null });
  } catch (error) {
    console.error("Auth me check error:", error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}
