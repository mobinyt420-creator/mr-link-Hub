export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "public",
  "assets",
  "static",
  "login",
  "auth",
  "dashboard",
  "settings",
  "analytics",
  "links",
  "pages",
  "_main",
  "home",
  "index",
  "go",
  "articles",
  "about",
  "contact",
  "privacy",
  "terms",
  "shortener",
]);


export interface SlugValidationResult {
  valid: boolean;
  error?: string;
  cleanedSlug?: string;
}

export function validateSlug(rawSlug: string): SlugValidationResult {
  if (!rawSlug || typeof rawSlug !== "string") {
    return { valid: false, error: "Slug is required." };
  }

  // Normalize: lower case, trim spaces
  const slug = rawSlug.trim().toLowerCase();

  if (slug.length < 2) {
    return { valid: false, error: "Slug must be at least 2 characters long." };
  }

  if (slug.length > 50) {
    return { valid: false, error: "Slug cannot exceed 50 characters." };
  }

  // Check reserved routes
  if (RESERVED_SLUGS.has(slug)) {
    return { valid: false, error: `"${slug}" is a reserved system route and cannot be used as a custom slug.` };
  }

  // Must only contain a-z, 0-9, and single hyphens between characters
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return {
      valid: false,
      error: "Slug may only contain lowercase letters, numbers, and hyphens (e.g. 'tiktok-01', 'proxy-download'). Cannot start or end with a hyphen.",
    };
  }

  return { valid: true, cleanedSlug: slug };
}

export function sanitizeUrl(rawUrl: string): string {
  if (!rawUrl) return "#";
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("mailto:") || trimmed.startsWith("tel:") || trimmed.startsWith("/")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}