"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { initAnalytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

interface AnalyticsTrackerProps {
  pageId: string;
}

export default function AnalyticsTracker({ pageId }: AnalyticsTrackerProps) {
  const searchParams = useSearchParams();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current || !pageId) return;
    trackedRef.current = true;

    const utmSource = searchParams.get("utm_source") || searchParams.get("ref") || "";
    const utmMedium = searchParams.get("utm_medium") || "";
    const utmCampaign = searchParams.get("utm_campaign") || "";

    // 1. Log to Firebase Analytics
    initAnalytics().then((analytics) => {
      if (analytics) {
        logEvent(analytics, "page_view", {
          page_id: pageId,
          page_location: window.location.href,
          page_path: window.location.pathname,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        });
      }
    }).catch(() => {});

    // 2. Internal analytics beacon tracking
    const payload = JSON.stringify({
      eventType: "PAGE_VIEW",
      pageId,
      utmSource,
      utmMedium,
      utmCampaign,
    });

    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/track", blob);
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore analytics tracking errors silently
    }
  }, [pageId, searchParams]);

  return null;
}