import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateAdmin, comparePassword, hashPassword } from "@/lib/auth";

export async function GET() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: "default" },
    });
  }

  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const {
      brandName,
      username,
      bio,
      avatarUrl,
      logoUrl,
      accentColor,
      glassIntensity,
      cardStyle,
      footerText,
      announcementActive,
      announcementText,
      announcementUrl,
      announcementIcon,
      seoTitle,
      seoDescription,
      ogImage,
      // Password change
      currentPassword,
      newPassword,
    } = data;

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to set a new password." }, { status: 400 });
      }

      const adminRecord = await prisma.adminUser.findUnique({
        where: { id: user.id },
      });

      if (!adminRecord || !(await comparePassword(currentPassword, adminRecord.passwordHash))) {
        return NextResponse.json({ error: "Current password does not match." }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
      }

      const newHash = await hashPassword(newPassword);
      await prisma.adminUser.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      });
    }

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        ...(brandName !== undefined && { brandName: brandName.trim() }),
        ...(username !== undefined && { username: username.trim() }),
        ...(bio !== undefined && { bio: bio.trim() }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl.trim() }),
        ...(logoUrl !== undefined && { logoUrl: logoUrl.trim() }),
        ...(accentColor !== undefined && { accentColor }),
        ...(glassIntensity !== undefined && { glassIntensity }),
        ...(cardStyle !== undefined && { cardStyle }),
        ...(footerText !== undefined && { footerText: footerText.trim() }),
        ...(announcementActive !== undefined && { announcementActive: Boolean(announcementActive) }),
        ...(announcementText !== undefined && { announcementText: announcementText.trim() }),
        ...(announcementUrl !== undefined && { announcementUrl: announcementUrl.trim() }),
        ...(announcementIcon !== undefined && { announcementIcon }),
        ...(seoTitle !== undefined && { seoTitle: seoTitle.trim() }),
        ...(seoDescription !== undefined && { seoDescription: seoDescription.trim() }),
        ...(ogImage !== undefined && { ogImage: ogImage.trim() }),
      },
      create: {
        id: "default",
        brandName: brandName || "Mobin X",
        username: username || "@mobinx",
      },
    });

    return NextResponse.json({ settings: updated, message: "Settings saved successfully." });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}