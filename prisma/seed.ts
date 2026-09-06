import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Admin User
  const passwordHash = await bcrypt.hash("admin123456", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@linkhub.com" },
    update: { passwordHash },
    create: {
      email: "admin@linkhub.com",
      name: "Mobin X Admin",
      passwordHash,
    },
  });

  // 2. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      brandName: "Mobin X",
      username: "@mobinx",
      bio: "Digital Creator • Tech Specialist • Gamer\nOfficial destination for premium gaming services, verified proxy servers & exclusive downloads.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      accentColor: "#6366f1",
      glassIntensity: "medium",
      cardStyle: "glass",
      footerText: "© 2026 Mobin X. All rights reserved. Built for speed & security.",
      announcementActive: true,
      announcementText: "🔥 Free Fire Top Up (Instant Delivery) & New Proxy Servers Online!",
      announcementUrl: "https://example.com/topup",
      announcementIcon: "Flame",
      seoTitle: "Mobin X — Official Hub, Top-Ups & Resources",
      seoDescription: "Official digital hub of Mobin X. Access fast top ups, proxy servers, download links, tutorials, and social channels.",
    },
  });

  // 3. Clear existing links and reseed cleanly
  await prisma.pageComponent.deleteMany({});
  await prisma.link.deleteMany({});

  const topUpLink = await prisma.link.create({
    data: {
      title: "Free Fire Top Up",
      description: "Instant UID Diamond Delivery • 24/7 Automated",
      url: "https://example.com/topup",
      icon: "Diamond",
      type: "featured",
      category: "Service",
      badge: "INSTANT",
      isActive: true,
      order: 1,
    },
  });

  const telegramLink = await prisma.link.create({
    data: {
      title: "Telegram Channel",
      description: "@mobinx_official • Daily config & VIP community",
      url: "https://t.me/mobinx_official",
      icon: "Telegram",
      type: "social",
      category: "Social",
      badge: "JOIN VIP",
      isActive: true,
      order: 2,
    },
  });

  const youtubeLink = await prisma.link.create({
    data: {
      title: "Official YouTube Channel",
      description: "Tutorials, Gameplay & Live Streams • Subscribe",
      url: "https://youtube.com/@mobinx",
      icon: "Youtube",
      type: "social",
      category: "Social",
      badge: "150K SUB",
      isActive: true,
      order: 3,
    },
  });

  const proxyDownloadLink = await prisma.link.create({
    data: {
      title: "Proxy Download (V2Ray / Clash)",
      description: "Direct APK & Config files for ultra-low ping gaming",
      url: "https://example.com/proxy-download",
      icon: "Download",
      type: "download",
      category: "Download",
      badge: "v4.2.1",
      isActive: true,
      order: 4,
    },
  });

  const proxyServerLink = await prisma.link.create({
    data: {
      title: "VIP Proxy Server Nodes",
      description: "Singapore, Germany & US dedicated high-speed routes",
      url: "https://example.com/proxy-nodes",
      icon: "Server",
      type: "standard",
      category: "Service",
      badge: "LOW PING",
      isActive: true,
      order: 5,
    },
  });

  const whatsappLink = await prisma.link.create({
    data: {
      title: "WhatsApp Official Channel",
      description: "Instant announcements & discount codes directly to your chat",
      url: "https://whatsapp.com/channel/example",
      icon: "WhatsApp",
      type: "social",
      category: "Social",
      badge: "UPDATES",
      isActive: true,
      order: 6,
    },
  });

  // 4. Main Website
  const mainPage = await prisma.page.upsert({
    where: { slug: "_main" },
    update: {},
    create: {
      name: "Main Website",
      slug: "_main",
      isMain: true,
      title: "Mobin X Portal",
      description: "Official Central Hub",
      isActive: true,
    },
  });

  const mainComponents = [
    { componentType: "SECTION_HEADING", headingText: "🔥 Top-Up & VIP Services", position: 0 },
    { componentType: "FEATURED_LINK", linkId: topUpLink.id, position: 1 },
    { componentType: "LINK_CARD", linkId: proxyServerLink.id, position: 2 },
    { componentType: "SECTION_HEADING", headingText: "⚡ Fast Downloads", position: 3 },
    { componentType: "DOWNLOAD_LINK", linkId: proxyDownloadLink.id, position: 4 },
    { componentType: "SECTION_HEADING", headingText: "🌐 Join Official Communities", position: 5 },
    { componentType: "SOCIAL_LINK", linkId: telegramLink.id, position: 6 },
    { componentType: "SOCIAL_LINK", linkId: youtubeLink.id, position: 7 },
    { componentType: "SOCIAL_LINK", linkId: whatsappLink.id, position: 8 },
  ];

  for (const comp of mainComponents) {
    await prisma.pageComponent.create({
      data: {
        pageId: mainPage.id,
        ...comp,
      },
    });
  }

  // 5. Extra Page
  const tiktokPage = await prisma.page.upsert({
    where: { slug: "tiktok-01" },
    update: {},
    create: {
      name: "TikTok Video 01",
      slug: "tiktok-01",
      isMain: false,
      title: "TikTok Deals",
      description: "Exclusive destinations from today's TikTok clip",
      isActive: true,
    },
  });

  await prisma.pageComponent.create({
    data: {
      pageId: tiktokPage.id,
      componentType: "FEATURED_LINK",
      linkId: topUpLink.id,
      position: 0,
    },
  });

  await prisma.pageComponent.create({
    data: {
      pageId: tiktokPage.id,
      componentType: "SOCIAL_LINK",
      linkId: youtubeLink.id,
      position: 1,
    },
  });

  console.log("Database seeded successfully with official icons & clean card structure!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });