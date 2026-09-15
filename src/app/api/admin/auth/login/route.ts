import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, hashPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "ইমেইল এবং পাসওয়ার্ড আবশ্যক (Email and password are required)." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Special handler for Instant 1-Click Demo Creator
    if (cleanEmail === "admin@linkhub.com" && password === "admin123456") {
      let demoUser = await prisma.adminUser.findUnique({
        where: { email: cleanEmail },
      });

      if (!demoUser) {
        const hash = await hashPassword("admin123456");
        demoUser = await prisma.adminUser.create({
          data: {
            email: cleanEmail,
            name: "Creator Admin",
            passwordHash: hash,
          },
        });
      }

      const token = signToken({
        userId: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
      });

      const response = NextResponse.json({
        success: true,
        user: { id: demoUser.id, email: demoUser.email, name: demoUser.name },
      });

      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // Standard user lookup
    const user = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ইমেইল বা পাসওয়ার্ড সঠিক নয় (Invalid email or password)." },
        { status: 401 }
      );
    }

    let isValid = false;
    if (user.passwordHash === "DEFAULT_CREATOR_ACCESS" && password === "admin123456") {
      isValid = true;
    } else {
      try {
        isValid = await comparePassword(password, user.passwordHash);
      } catch {
        isValid = false;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "ইমেইল বা পাসওয়ার্ড সঠিক নয় (Invalid email or password)." },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "লগইন করার সময় ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
