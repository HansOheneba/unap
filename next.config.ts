import type { NextConfig } from "next";

// Note: browser calls to the real API are handled by
// `app/api/backend/[...path]/route.ts` (an authenticated proxy that attaches
// tokens from httpOnly cookies), not by a next.config.ts rewrite. A plain
// rewrite can't set/read cookies or manage token refresh, which is why this
// file intentionally has no `rewrites()` for `/api/backend/*` anymore.
const nextConfig: NextConfig = {
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
  },
};

export default nextConfig;
