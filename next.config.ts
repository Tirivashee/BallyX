import type { NextConfig } from "next";

/**
 * Security headers applied to every response. The CSP is intentionally
 * strict for a site with no third-party scripts, no analytics, and no
 * user-generated content:
 *   - script-src 'unsafe-inline' covers the small inline JSON-LD blocks
 *     we render ourselves (Organization / SoftwareApplication structured
 *     data) plus Next's own hydration data script.
 *   - script-src 'unsafe-eval' is required by Framer Motion, which the
 *     scroll-reveal components (components/motion/reveal.tsx) depend
 *     on for its whileInView animations — confirmed by testing: with
 *     'unsafe-eval' removed, those animations silently never fire (no
 *     thrown error visible to a normal visitor, just content stuck at
 *     opacity: 0) instead of failing loudly. If Framer Motion is ever
 *     dropped, remove this too.
 *   - Hardening further would mean moving to a per-request nonce via
 *     middleware instead of 'unsafe-inline' — worth doing before this
 *     site handles any user-generated or third-party content.
 *   - The WhatsApp CTA is a plain <a href="https://wa.me/...">, not a
 *     fetch, so it isn't governed by connect-src at all.
 */
function buildCsp(scriptSrc: string, { imgSrc = "'self' data:", connectSrc = "'self'" } = {}): string {
  return `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src ${imgSrc};
    font-src 'self' data:;
    connect-src ${connectSrc};
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `
    .replace(/\s{2,}/g, " ")
    .trim();
}

// img-src/connect-src both need Vercel Blob's hosts for the admin apps/blog
// upload widgets (components/dashboard/image-upload-field.tsx): the client
// upload() call posts to vercel.com's API, and the resulting public files
// are served from <store-id>.public.blob.vercel-storage.com. Auth pages
// below deliberately don't get this — they have no image uploads.
const ContentSecurityPolicy = buildCsp("'self' 'unsafe-inline' 'unsafe-eval'", {
  imgSrc: "'self' data: https://*.public.blob.vercel-storage.com",
  connectSrc: "'self' https://vercel.com",
});

// The signup/signin/confirm pages have no Framer Motion scroll-reveal
// animations, so they don't need 'unsafe-eval' — and since they collect
// credentials, a stricter CSP is worth the extra header block. An XSS
// there would otherwise reach a password field.
const AuthContentSecurityPolicy = buildCsp("'self' 'unsafe-inline'");

const baseHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  ...baseHeaders,
];

const authSecurityHeaders = [
  { key: "Content-Security-Policy", value: AuthContentSecurityPolicy },
  ...baseHeaders,
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The invoice tool moved from its own standalone area into the
      // admin dashboard (/dashboard/invoice) so it lives alongside the
      // other admin content-management tools.
      { source: "/tools/invoice", destination: "/dashboard/invoice", permanent: true },
      {
        source: "/tools/invoice/settings",
        destination: "/dashboard/invoice/settings",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // Auth routes get their own headers block with a distinct `source`
      // pattern rather than a second overlapping entry after the
      // catch-all below — that way exactly one entry ever matches a
      // given path, so there's no same-key header-merge precedence to
      // rely on (verified: `curl -I` on /signup shows no 'unsafe-eval'
      // while / still has it).
      {
        source: "/(signup|signin|auth/confirm)",
        headers: authSecurityHeaders,
      },
      {
        source: "/:path((?!signup$|signin$|auth/confirm$).*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
