/**
 * Dynamic domain resolution utility
 * Automatically determines the appropriate host (e.g. Vercel deployment URL, custom domain, or local host)
 */

export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server-side resolution
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  return "https://mr-link-Hub.vercel.app";
}

export function formatBioUrl(username: string): string {
  const base = getBaseUrl();
  const cleanUser = (username || "creator").replace(/^@/, "").trim();
  return `${base}/u/${cleanUser}`;
}

export function formatPageUrl(slug: string): string {
  const base = getBaseUrl();
  const cleanSlug = (slug || "").replace(/^\//, "").trim();
  return `${base}/${cleanSlug}`;
}
