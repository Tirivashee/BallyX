# BallyX website

The official marketing website for **BallyX**, a software studio in Harare,
Zimbabwe, and marketing site for its flagship product, **Pluto** — a
local-first point-of-sale and business-management system for African SMEs.

This repo is the website only. Pluto itself is a separate desktop
application (Tauri + React) — this site markets it, it doesn't embed it.

## Stack

- **Next.js 15** (App Router, Server Components) + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-variable-based theme, see `app/globals.css`)
- Hand-themed **shadcn/ui-style** primitives in `components/ui/` (Radix UI
  underneath: accordion, label, slot) — copied and themed to the brand
  tokens rather than left at defaults
- **lucide-react** for icons, **Framer Motion** for scroll reveals
- **Zod** for server-side form validation
- pnpm, ESLint (flat config) + `eslint-config-next`

## Running locally

```bash
pnpm install
pnpm dev
```

Open the URL it prints (defaults to [http://localhost:3000](http://localhost:3000),
falls back to the next free port if that's taken).

Other scripts:

```bash
pnpm build   # production build
pnpm start   # run the production build locally
pnpm lint    # ESLint
```

## Where things live

### Brand & content — one file to edit

**Every brand string and content block is in [`lib/site-config.ts`](lib/site-config.ts).**
Company name, tagline, WhatsApp number, Pluto's copy (differentiators,
features, roadmap, FAQ), use-cases, values, founder note, timeline, nav,
and footer links all live there, fully typed and commented.

If you're renaming the company (e.g. "BallyX" → "Ballylike"), change
`brand.name` / `brand.shortName` in that one file — every page, the
footer, and the JSON-LD metadata picks it up automatically.

Services are in a separate typed file, [`lib/services.ts`](lib/services.ts),
because that list is deliberately short and meant to only ever list what
the team can actually deliver — see the comment at the top of that file.

### Design tokens — one file to re-skin

**All colors, radii, and font bindings are CSS variables in
[`app/globals.css`](app/globals.css)**, exposed to Tailwind via `@theme`.
To re-skin the site (change the accent color, swap the neutrals, etc.),
edit the `:root` block at the top of that file — every `bg-ink`,
`text-accent-deep`, `border-border-on-ink`, etc. utility across the site
follows automatically.

That file also documents the WCAG AA contrast checks behind the color
choices (notably: the bright accent orange fails AA as text on the paper
background and must only be used for backgrounds/icons/borders/text-on-ink;
`--accent-deep` is the AA-safe orange for text on paper).

Fonts are wired up in [`app/layout.tsx`](app/layout.tsx) via `next/font/google`:
Space Grotesk (headings), Inter (body), JetBrains Mono (eyebrows/labels).

### Pages

| Route        | Purpose |
|--------------|---------|
| `/`          | Home — hero, what-we-do strip, Pluto flagship section, use-cases, why-BallyX, founder note, testimonials placeholder, closing CTA |
| `/product`   | Full Pluto breakdown — differentiators in depth, features, screenshots, roadmap, FAQ, pricing/early-access |
| `/services`  | Honest, typed list of what the studio delivers |
| `/about`     | Story, mission/vision, values, timeline, founder-led team |
| `/contact`   | Contact form (server action) + WhatsApp/email/location |
| `/privacy`, `/terms` | Placeholder legal pages — see TODO below |

### Contact form

[`components/sections/contact/contact-form.tsx`](components/sections/contact/contact-form.tsx)
is a client component using React's `useActionState`, submitting to the
server action in [`lib/actions/contact.ts`](lib/actions/contact.ts).

- All fields are validated **server-side with Zod** — never trust the
  client. Client-side `required`/`minLength` attributes are just UX sugar.
- A honeypot field (`website`) is hidden off-screen via CSS (not
  `display:none`, since some bots skip that) — a filled-in honeypot is
  silently treated as success without being processed.
- With no `RESEND_API_KEY` / `CONTACT_NOTIFY_EMAIL` set, submissions are
  validated and logged to the server console — the form works out of the
  box with zero backend config. Set both env vars (see `.env.example`) to
  actually email a notification via [Resend](https://resend.com).
- There's a `TODO(rate-limiting)` comment in `contact.ts` marking where to
  add IP/session-based rate limiting before this goes live for real.

### Security

- Security headers + a CSP are set in [`next.config.ts`](next.config.ts):
  HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, and a CSP scoped to `'self'`.
- The CSP allows `'unsafe-eval'` in `script-src` — this was **not** a
  default/lazy choice. Framer Motion's `whileInView` scroll-reveal
  animations were tested and confirmed to silently fail (content stuck at
  `opacity: 0`, no visible error) without it. The reasoning is documented
  in a comment directly above the CSP in `next.config.ts`.
- Secrets (`RESEND_API_KEY`) are read from `process.env` server-side only
  and never referenced from client components.

### SEO

- Per-page metadata (title template, description, OG/Twitter cards) via
  the Next Metadata API on every route.
- `app/opengraph-image.tsx` generates the OG share image dynamically
  (`next/og`) rather than a static placeholder file.
- `app/sitemap.ts` and `app/robots.ts` are generated from the same route
  list / `brand.url`.
- `Organization` JSON-LD in `app/layout.tsx`, `SoftwareApplication`
  JSON-LD in `app/product/page.tsx`.

## Deploying to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Import it in [Vercel](https://vercel.com/new) — it auto-detects
   Next.js, no config needed.
3. Add the optional env vars from `.env.example` in the Vercel project
   settings if you want the contact form to send real emails.
4. Update `brand.url` in `lib/site-config.ts` to the real production
   domain once you have it (used in metadata, sitemap, and JSON-LD).

## TODO before this goes live

Everything below is a deliberate placeholder. Grep the codebase for
`{{` to find every `{{PLACEHOLDER}}`-style marker directly in content —
this list also covers placeholders that aren't literally bracketed
(images, numbers, legal copy).

**Brand / contact (`lib/site-config.ts`)**
- [ ] `brand.url` — real production domain
- [ ] `brand.email` — real contact email
- [ ] `brand.whatsapp.number` / `brand.whatsapp.display` — real WhatsApp number
- [ ] `brand.social` — real social links, if/when they exist

**Pluto (`lib/site-config.ts`)**
- [ ] `pluto.status` / `pluto.statusDisplay` — current real status
- [ ] `pluto.pricing` / `pluto.pricingDisplay` — real pricing once decided

**People (`lib/site-config.ts`)**
- [ ] `founderNote.name` — real founder name
- [ ] `team[0].name`, `.bio` — real founder bio
- [ ] Replace the "FN" / "Photo" placeholder avatars in
      `components/sections/home/founder-note.tsx` and
      `components/sections/about/team.tsx` with real photos

**Screenshots**
- [ ] Everything in `public/images/screenshots/*.svg` is an illustrative
      mockup, not a real product screenshot. Swap in real Pluto screenshots
      (same aspect ratio, ~16:10) — no component changes needed, just
      replace the files and update `src` paths in
      `components/sections/product/screenshot-gallery.tsx`,
      `components/sections/home/pluto-flagship.tsx`, and
      `components/sections/product/product-hero.tsx`.

**Legal**
- [ ] `app/privacy/page.tsx` and `app/terms/page.tsx` are plain-language
      placeholders, not reviewed legal documents. Have these properly
      drafted/reviewed before launch.

**Testimonials**
- [ ] `components/sections/home/testimonials-placeholder.tsx` is
      intentionally empty of real quotes. Replace it with real founding-
      customer testimonials once they exist — don't fill it with
      anything fabricated before then.

**Infra**
- [ ] Wire up `RESEND_API_KEY` + `CONTACT_NOTIFY_EMAIL` (see
      `.env.example`) once you want real email notifications from the
      contact form.
- [ ] Add rate limiting to the contact form server action — see the
      `TODO(rate-limiting)` comment in `lib/actions/contact.ts`.
- [ ] Replace `app/favicon.ico` (currently the default Next.js icon) with
      a real BallyX favicon.
