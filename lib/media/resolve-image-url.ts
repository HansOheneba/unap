import { BRAND_PLACEHOLDER } from "@/lib/data/placeholders";

export const STOREFRONT_FALLBACK_IMAGE = BRAND_PLACEHOLDER.textile;

/** Soft zinc surface behind packshots so transparent PNGs don't clash with grid/page colors. */
export const PRODUCT_IMAGE_SURFACE_CLASS = "bg-zinc-50";

/**
 * Ask Cloudinary for a storefront-sized derivative instead of the camera master.
 * Catalog shots are often 6–8k / multi‑MB; those stall Next/Image and blank the UI.
 */
const CLOUDINARY_STOREFRONT_TRANSFORM = "c_limit,w_2000,q_auto,f_auto";

function withCloudinaryDelivery(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "res.cloudinary.com") return url;

    const uploadMarker = "/image/upload/";
    const markerIndex = parsed.pathname.indexOf(uploadMarker);
    if (markerIndex === -1) return url;

    const afterUpload = parsed.pathname.slice(
      markerIndex + uploadMarker.length,
    );
    // Already transformed (ops use commas, or a known transform prefix).
    if (
      afterUpload.includes(",") ||
      /^(c_|w_|h_|q_|f_|fl_|e_|dpr_)/.test(afterUpload)
    ) {
      return url;
    }

    parsed.pathname =
      parsed.pathname.slice(0, markerIndex + uploadMarker.length) +
      `${CLOUDINARY_STOREFRONT_TRANSFORM}/` +
      afterUpload;
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Normalize any catalog / cart / wishlist image URL for Next/Image.
 * Empty, filesystem, or malformed values fall back to a local brand asset.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url?.trim()) return STOREFRONT_FALLBACK_IMAGE;
  const trimmed = url.trim();
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return withCloudinaryDelivery(trimmed);
  }
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    // Reject OS absolute paths that look like site-root URLs.
    // Keep `/home/...` public assets (e.g. `/home/track.jpg`); only reject
    // Linux home dirs shaped like `/home/<user>/...`.
    if (
      trimmed.startsWith("/Users/") ||
      /^\/home\/[^/]+\//.test(trimmed) ||
      trimmed.startsWith("/var/") ||
      trimmed.startsWith("/tmp/")
    ) {
      return STOREFRONT_FALLBACK_IMAGE;
    }
    return trimmed;
  }
  return STOREFRONT_FALLBACK_IMAGE;
}

export function isRemoteImageSrc(src: string): boolean {
  return /^https?:\/\//.test(src);
}
