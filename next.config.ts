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
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self' data:;
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
