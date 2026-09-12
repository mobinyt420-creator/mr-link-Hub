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
      brandName: "Mr Mobin 1M",
      username: "mobin",
      bio: "",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      accentColor: "#6366f1",
      glassIntensity: "medium",
      cardStyle: "glass",
      footerText: "© 2026 Mr Mobin 1M. All rights reserved.",
      announcementActive: false,
      announcementText: "",
      announcementUrl: "",
      announcementIcon: "Flame",
      seoTitle: "Mr Mobin 1M — Official Hub & Links",
      seoDescription: "Official digital hub of Mr Mobin 1M. All links in one place.",
    },
  });

  // 3. Clear existing links and reseed cleanly
  await prisma.pageComponent.deleteMany({});
  await prisma.link.deleteMany({});

  const topUpLink = await prisma.link.create({
    data: {
      title: "Free Fire Top Up",
      description: "",
      url: "https://example.com/topup",
      icon: "Diamond",
      type: "featured",
      category: "Service",
      badge: "",
      isActive: true,
      order: 1,
    },
  });

  const telegramLink = await prisma.link.create({
    data: {
      title: "Telegram Channel",
      description: "",
      url: "https://t.me/mobinx_official",
      icon: "Telegram",
      type: "social",
      category: "Social",
      badge: "",
      isActive: true,
      order: 2,
    },
  });

  const youtubeLink = await prisma.link.create({
    data: {
      title: "Official YouTube Channel",
      description: "",
      url: "https://youtube.com/@mobinx",
      icon: "Youtube",
      type: "social",
      category: "Social",
      badge: "",
      isActive: true,
      order: 3,
    },
  });

  const proxyDownloadLink = await prisma.link.create({
    data: {
      title: "Proxy Download",
      description: "",
      url: "https://example.com/proxy-download",
      icon: "Download",
      type: "download",
      category: "Download",
      badge: "",
      isActive: true,
      order: 4,
    },
  });

  const proxyServerLink = await prisma.link.create({
    data: {
      title: "VIP Proxy Server Nodes",
      description: "",
      url: "https://example.com/proxy-nodes",
      icon: "Server",
      type: "standard",
      category: "Service",
      badge: "",
      isActive: true,
      order: 5,
    },
  });

  const whatsappLink = await prisma.link.create({
    data: {
      title: "WhatsApp Official Channel",
      description: "",
      url: "https://whatsapp.com/channel/example",
      icon: "WhatsApp",
      type: "social",
      category: "Social",
      badge: "",
      isActive: true,
      order: 6,
    },
  });

  // 4. Main Website — flat list, NO section headings
  const mainPage = await prisma.page.upsert({
    where: { slug: "_main" },
    update: {},
    create: {
      name: "Main Website",
      slug: "_main",
      isMain: true,
      title: "Mr Mobin 1M",
      description: "Official Hub",
      isActive: true,
    },
  });

  // Clean flat components — no section headings, just links
  const mainComponents = [
    { componentType: "FEATURED_LINK", linkId: topUpLink.id, position: 0 },
    { componentType: "LINK_CARD", linkId: proxyServerLink.id, position: 1 },
    { componentType: "DOWNLOAD_LINK", linkId: proxyDownloadLink.id, position: 2 },
    { componentType: "SOCIAL_LINK", linkId: telegramLink.id, position: 3 },
    { componentType: "SOCIAL_LINK", linkId: youtubeLink.id, position: 4 },
    { componentType: "SOCIAL_LINK", linkId: whatsappLink.id, position: 5 },
  ];

  for (const comp of mainComponents) {
    await prisma.pageComponent.create({
      data: {
        pageId: mainPage.id,
        ...comp,
      },
    });
  }

  // 5. Extra Page example
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

  console.log("Database seeded — clean flat card structure, no section headings!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });