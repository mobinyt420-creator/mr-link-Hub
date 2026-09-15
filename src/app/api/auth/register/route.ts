import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, username, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "ইমেইল এবং পাসওয়ার্ড আবশ্যক (Email and password are required)." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Password must be at least 6 characters)." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = (username || cleanEmail.split("@")[0])
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "")
      .slice(0, 30) || `user${Math.floor(1000 + Math.random() * 9000)}`;

    // Check if user already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "এই ইমেইল দিয়ে ইতিমধ্যে একাউন্ট তৈরি করা আছে (Account with this email already exists)." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.adminUser.create({
      data: {
        email: cleanEmail,
        name: name?.trim() || cleanUsername,
        passwordHash,
      },
    });

    // Create or link their personal Bio page
    try {
      const existingPage = await prisma.page.findUnique({
        where: { slug: cleanUsername },
      });

      if (!existingPage) {
        await prisma.page.create({
          data: {
            name: name?.trim() || cleanUsername,
            slug: cleanUsername,
            title: `${name?.trim() || cleanUsername} — Official Bio`,
            description: "Digital Creator • Personal Hub",
            isActive: true,
            isMain: false,
          },
        });
      }
    } catch (pageErr) {
      console.warn("Auto bio page creation notice:", pageErr);
    }

    // Generate session token
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: cleanUsername,
      },
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
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "রেজিস্ট্রেশন সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
