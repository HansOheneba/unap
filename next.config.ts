import type { NextConfig } from "next";

// Note: browser calls to the real API are handled by
// `app/api/backend/[...path]/route.ts` (an authenticated proxy that attaches
// tokens from httpOnly cookies), not by a next.config.ts rewrite. A plain
// rewrite can't set/read cookies or manage token refresh, which is why this
// file intentionally has no `rewrites()` for `/api/backend/*` anymore.
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/track",
        destination: "/tracking",
        permanent: true,
      },
      {
        source: "/track/:trackingNumber",
        destination: "/tracking/:trackingNumber",
        permanent: true,
      },
    ];
  },
  images: {
    // Product images now come from the catalog API and may be hosted on any
    // domain the backend/admin team uploads to (in addition to our own
    // `/public` assets, which don't need a pattern). Allow any HTTPS host
    // rather than maintaining an allowlist here.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    // Camera masters from Cloudinary can exceed the default fetch budget when
    // something still goes through /_next/image. Prefer CDN transforms, but
    // don't 413 the rare untransformed remote.
    maximumResponseBody: 100_000_000,
    // Cut Image Cache Writes: stop re-optimizing every ~60s default, skip AVIF
    // twin variants, and only mint widths we actually use in sizes=.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    formats: ["image/webp"],
    deviceSizes: [640, 750, 1080, 1920],
    imageSizes: [48, 64, 96, 128, 256],
  },
};

export default nextConfig;
