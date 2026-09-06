const BASE = "http://localhost:3000";
let sessionCookie = "";

async function request(path, options = {}) {
  const url = new URL(path, BASE);
  const headers = options.headers || {};
  if (sessionCookie) {
    headers["Cookie"] = sessionCookie;
  }
  if (options.body && typeof options.body === "object") {
    options.body = JSON.stringify(options.body);
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    headers,
    body: options.body,
    redirect: "manual",
  });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    const match = setCookie.match(/linkhub_session=[^;]+/);
    if (match) {
      sessionCookie = match[0];
    }
  }

  const contentType = res.headers.get("content-type") || "";
  let data = null;
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return { status: res.status, headers: res.headers, data };
}

function assert(condition, message) {
  if (!condition) {
    console.error("❌ ASSERTION FAILED:", message);
    process.exit(1);
  }
  console.log("  ✓", message);
}

async function runTests() {
  console.log("🚀 Starting End-to-End Verification Suite for LinkHub Platform...\n");

  // TEST 1: Admin Login
  console.log("TEST 1: Admin Login & Session Generation");
  const loginRes = await request("/api/auth/login", {
    method: "POST",
    body: { email: "admin@linkhub.com", password: "admin123456" },
  });
  assert(loginRes.status === 200, "Login returns 200 OK");
  assert(loginRes.data.success === true, "Login returns success: true");
  assert(Boolean(sessionCookie), "Received linkhub_session cookie");

  // TEST 2: Verify Protected Route (/api/auth/me)
  console.log("\nTEST 2: Verify Protected Route (/api/auth/me)");
  const meRes = await request("/api/auth/me");
  assert(meRes.status === 200, "Me endpoint returns 200 with session");
  assert(meRes.data.user.email === "admin@linkhub.com", "Me returns correct admin email");

  // Cleanup any old test pages from previous runs
  const pagesCleanupList = await request("/api/pages");
  for (const p of pagesCleanupList.data.pages) {
    if (p.slug.startsWith("tiktok-01-copy") || p.slug === "tiktok-02" || p.slug.startsWith("test-")) {
      await request(`/api/pages/${p.id}`, { method: "DELETE" });
    }
  }

  // TEST 3: Link Library Inspection & Ensure active
  console.log("\nTEST 3: Link Library Inspection");
  const linksRes = await request("/api/links");
  assert(linksRes.status === 200, "Links API returns 200");
  const links = linksRes.data.links;
  assert(links.length >= 4, `Found ${links.length} links in library`);
  const topUp = links.find((l) => l.title.includes("Top Up"));
  const youtube = links.find((l) => l.title.includes("YouTube"));
  const telegram = links.find((l) => l.title.includes("Telegram"));
  const proxyDownload = links.find((l) => l.title.includes("Proxy Download"));
  assert(Boolean(topUp), "Free Fire Top Up exists in library");
  assert(Boolean(youtube), "YouTube exists in library");
  assert(Boolean(telegram), "Telegram exists in library");
  assert(Boolean(proxyDownload), "Proxy Download exists in library");

  // Ensure topUp is active
  await request(`/api/links/${topUp.id}`, { method: "PUT", body: { isActive: true } });

  // TEST 4: Fetch Main Website (/)
  console.log("\nTEST 4: Main Website (/) Verification");
  const mainSiteRes = await request("/");
  assert(mainSiteRes.status === 200, "Main website returns 200 OK");
  assert(mainSiteRes.data.includes("Mobin X"), "Main website contains brand name 'Mobin X'");
  assert(mainSiteRes.data.includes("Free Fire Top Up"), "Main website contains Free Fire Top Up");
  assert(mainSiteRes.data.includes("YouTube"), "Main website contains YouTube");

  // TEST 5: Create Extra Page "TikTok Video 01" with slug "tiktok-01"
  console.log("\nTEST 5: Create Extra Page ('TikTok Video 01', slug: 'tiktok-01')");
  const pagesListRes = await request("/api/pages");
  let tiktokPage = pagesListRes.data.pages.find((p) => p.slug === "tiktok-01");
  if (!tiktokPage) {
    const createPageRes = await request("/api/pages", {
      method: "POST",
      body: {
        name: "TikTok Video 01",
        slug: "tiktok-01",
        title: "TikTok Video 01 Deals",
        description: "Special links from today's clip",
        isActive: true,
      },
    });
    assert(createPageRes.status === 201, "Created page returns 201 Created");
    tiktokPage = createPageRes.data.page;
  }
  assert(tiktokPage.slug === "tiktok-01", "Page slug is tiktok-01");

  // TEST 6: Set only Top Up and YouTube on TikTok Video 01
  console.log("\nTEST 6: Configure TikTok Video 01 to only contain Top Up + YouTube");
  const updatePageRes = await request(`/api/pages/${tiktokPage.id}`, {
    method: "PUT",
    body: {
      name: "TikTok Video 01",
      slug: "tiktok-01",
      isActive: true,
      components: [
        { componentType: "FEATURED_LINK", linkId: topUp.id, isVisible: true },
        { componentType: "SOCIAL_LINK", linkId: youtube.id, isVisible: true },
      ],
    },
  });
  assert(updatePageRes.status === 200, "Updated page components returns 200");
  assert(updatePageRes.data.page.components.length === 2, "TikTok page has exactly 2 components");

  // TEST 7: Open /tiktok-01 and verify only Top Up and YouTube appear
  console.log("\nTEST 7: Open /tiktok-01 Public Page & Confirm Contents");
  const publicTiktokRes = await request("/tiktok-01");
  assert(publicTiktokRes.status === 200, "Public /tiktok-01 returns 200 OK");
  assert(publicTiktokRes.data.includes("Free Fire Top Up"), "Public page contains Free Fire Top Up");
  assert(publicTiktokRes.data.includes("YouTube"), "Public page contains YouTube");
  assert(!publicTiktokRes.data.includes("Proxy Download (V2Ray / Clash)"), "Proxy Download does NOT appear on /tiktok-01");
  assert(!publicTiktokRes.data.includes("Telegram VIP Community"), "Telegram does NOT appear on /tiktok-01");

  // TEST 8: Central Source Principle (Update Telegram in Library -> Verifies automatic propagation)
  console.log("\nTEST 8: Central Source Principle: Update Telegram URL in Link Library");
  const newTelegramUrl = "https://t.me/mobinx_NEW_SUPER_VIP_2026";
  const updateLinkRes = await request(`/api/links/${telegram.id}`, {
    method: "PUT",
    body: { url: newTelegramUrl },
  });
  assert(updateLinkRes.status === 200, "Updated link in library returns 200");
  assert(updateLinkRes.data.link.url === newTelegramUrl, "Link library has new Telegram URL");

  // Fetch Main Website and confirm it now uses new Telegram URL automatically
  const mainSiteAfterUpdate = await request("/");
  assert(
    mainSiteAfterUpdate.data.includes(newTelegramUrl),
    "Main Website immediately reflected new Telegram URL without editing the page!"
  );

  // TEST 9: Duplicate Page
  console.log("\nTEST 9: Page Duplication (1-Click Clone)");
  const duplicateRes = await request(`/api/pages/${tiktokPage.id}/duplicate`, {
    method: "POST",
  });
  assert(duplicateRes.status === 201, "Duplicated page returns 201");
  const duplicatedPage = duplicateRes.data.page;
  assert(duplicatedPage.name.includes("(Copy)"), "Duplicated page has '(Copy)' suffix");
  assert(duplicatedPage.slug.includes("tiktok-01-copy"), "Duplicated page has unique '-copy' slug");

  // TEST 10: Independence of Duplicated Page
  console.log("\nTEST 10: Independence of Cloned Page");
  const updateCloneRes = await request(`/api/pages/${duplicatedPage.id}`, {
    method: "PUT",
    body: {
      name: "TikTok Campaign 02",
      slug: duplicatedPage.slug,
      isActive: true,
      components: [
        { componentType: "DOWNLOAD_LINK", linkId: proxyDownload.id, isVisible: true },
      ],
    },
  });
  assert(updateCloneRes.status === 200, "Updated cloned page returns 200");
  const publicCloneRes = await request(`/${duplicatedPage.slug}`);
  assert(publicCloneRes.status === 200, `Public /${duplicatedPage.slug} returns 200`);
  assert(publicCloneRes.data.includes("Proxy Download"), "Cloned page contains Proxy Download");

  // Original /tiktok-01 should still contain Top Up and YouTube
  const originalCheckRes = await request("/tiktok-01");
  assert(originalCheckRes.data.includes("Free Fire Top Up"), "Original /tiktok-01 remains unaffected");

  // TEST 11: Active / Inactive Link Toggle
  console.log("\nTEST 11: Active / Inactive Link Toggle");
  // Temporarily disable Top Up link
  await request(`/api/links/${topUp.id}`, {
    method: "PUT",
    body: { isActive: false },
  });
  const publicTiktokDisabledRes = await request("/tiktok-01");
  assert(
    !publicTiktokDisabledRes.data.includes("Free Fire Top Up"),
    "Disabled link automatically disappears from public page"
  );
  // Re-enable Top Up link
  await request(`/api/links/${topUp.id}`, {
    method: "PUT",
    body: { isActive: true },
  });
  const publicTiktokReEnabledRes = await request("/tiktok-01");
  assert(
    publicTiktokReEnabledRes.data.includes("Free Fire Top Up"),
    "Re-enabled link immediately reappears on public page"
  );

  // TEST 12: Analytics Tracking & Verification
  console.log("\nTEST 12: Analytics Tracking (Views, Clicks, Referrers)");
  // Track page view
  await request("/api/analytics/track", {
    method: "POST",
    body: {
      eventType: "PAGE_VIEW",
      pageId: tiktokPage.id,
      utmSource: "https://www.tiktok.com/@mobinx",
    },
  });

  // Track link click
  await request("/api/analytics/track", {
    method: "POST",
    body: {
      eventType: "LINK_CLICK",
      pageId: tiktokPage.id,
      linkId: topUp.id,
    },
  });

  // Query analytics stats
  const statsRes = await request("/api/analytics/stats");
  assert(statsRes.status === 200, "Analytics stats API returns 200");
  assert(statsRes.data.summary.totalViews > 0, "Total Views tracked > 0");
  assert(statsRes.data.summary.totalClicks > 0, "Total Clicks tracked > 0");
  const tiktokRef = statsRes.data.referrers.find((r) => r.name === "TikTok");
  assert(Boolean(tiktokRef), "Referrer 'TikTok' recorded in analytics breakdown");

  // TEST 13: Slug Validation & Route Protection
  console.log("\nTEST 13: Slug Validation & System Route Protection");
  const reservedSlugRes = await request("/api/pages", {
    method: "POST",
    body: { name: "Illegal Page", slug: "admin" },
  });
  assert(reservedSlugRes.status === 400, "Reject reserved slug 'admin' with 400");
  assert(reservedSlugRes.data.error.includes("reserved"), "Error message mentions reserved route");

  const invalidCharsSlugRes = await request("/api/pages", {
    method: "POST",
    body: { name: "Bad Slug", slug: "invalid slug with spaces!" },
  });
  assert(invalidCharsSlugRes.status === 400, "Reject slug with spaces/symbols with 400");

  // TEST 14: Non-existent Page 404
  console.log("\nTEST 14: 404 Handling for Non-existent / Disabled Slugs");
  const notFoundRes = await request("/non-existent-page-xyz-404");
  assert(notFoundRes.status === 404, "Unknown slug returns 404 Not Found");

  // TEST 15: Main Website Protection Against Deletion
  console.log("\nTEST 15: Delete Protection for Permanent Main Website");
  const mainSiteRecord = pagesListRes.data.pages.find((p) => p.isMain);
  const deleteMainRes = await request(`/api/pages/${mainSiteRecord.id}`, {
    method: "DELETE",
  });
  assert(deleteMainRes.status === 400, "Attempt to delete permanent Main Website rejected with 400");

  // Clean up duplicated page
  await request(`/api/pages/${duplicatedPage.id}`, { method: "DELETE" });
  console.log("  ✓ Cleaned up test cloned page");

  console.log("\n🎉 ALL 15 AUTOMATED TESTS & VERIFICATIONS PASSED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});