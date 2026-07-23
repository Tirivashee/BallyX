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
  add IP/session-based rate limiting before this goes live for real —
  still open. (The sign-up/sign-in/confirm actions below do have real
  rate limiting; it just hasn't been ported back to this older form yet.)

### Sign-up / sign-in

Separate from the single shared admin login below: real email/password
accounts with email confirmation, for
[`lib/actions/signup.ts`](lib/actions/signup.ts) /
[`signin.ts`](lib/actions/signin.ts) / [`confirm.ts`](lib/actions/confirm.ts),
backing `/signup`, `/signin`, and `/auth/confirm`.

- **Signing up and confirming an account does not grant access to
  `/dashboard` or `/tools/invoice`.** Those stay admin-only — see
  `middleware.ts`, which checks the session's `sub` claim (`"admin"` vs
  `"user"`), not just "is there a valid session." This is currently just
  the auth mechanism; nothing is wired up to use it as a permission yet.
- Passwords are hashed with `@node-rs/argon2` (Node-only), separate from
  the admin account's scrypt hash in `lib/auth/password.ts`.
- The signup response is **identical** for a new account, an already-
  registered email, and a rate-limited attempt — see the invariants
  documented at the top of `lib/actions/signup.ts`. An already-registered
  email gets a notice email instead of telling the requester.
- Confirmation tokens: only a `sha256` hash is ever stored
  (`email_verification_tokens.token_hash`, `bytea`); the raw token exists
  only in the emailed link. The link is a GET page
  (`app/auth/confirm/page.tsx`) rendering a button that POSTs to actually
  consume the token — GET itself never does, so mail-security-gateway
  link prefetching can't burn it before the user clicks.
- Rate limiting (`lib/auth/rate-limit.ts`) is a single atomic
  `INSERT ... ON CONFLICT DO UPDATE` per check against the `rate_limits`
  table — signup 5/hr by IP and 3/hr by email, sign-in 10/hr by IP,
  confirm 20/hr by IP. IP is only trusted from `x-forwarded-for` when
  `VERCEL === "1"`; elsewhere requests share one IP-bucket and only the
  email-based limit narrows further.
- `/signup`, `/signin`, and `/auth/confirm` get a stricter CSP than the
  rest of the site (no `unsafe-eval`) — see Security below.
- No email is sent from the confirmation handler and no session is
  created there either — see the comment in `lib/actions/confirm.ts`.

### Database

Postgres, via `pg` — connection pool in [`lib/db.ts`](lib/db.ts), configured
with `PGHOST`/`PGPORT`/`PGUSER`/`PGPASSWORD`/`PGDATABASE` (see
`.env.example`). Schema in [`db/schema.sql`](db/schema.sql) — **one file**,
every statement `CREATE TABLE/INDEX IF NOT EXISTS`, no migration-tracking
table. New tables are appended here rather than as separate numbered
migration files, since `scripts/db-migrate.js` only ever applies this one
file — there's no runner for a `migrations/` directory.

- `npm run db:migrate` — creates/updates tables (idempotent, safe to re-run).
- `npm run db:seed` — (re)populates the dashboard demo tables from
  [`db/seed.sql`](db/seed.sql). Truncates and reinserts, so it's meant for
  the illustrative dashboard data only — never run it against real
  `contact_submissions` or `invoice_tool_invoices` rows.

What's backed by it:
- **Contact form** — every validated, non-honeypot submission is also
  inserted into `contact_submissions` (in addition to the email
  notification / console log). A DB failure here is logged but doesn't
  fail the user's submission.
- **Invoice tool** (`/tools/invoice`) — every generated PDF is saved to
  `invoice_tool_invoices` / `invoice_tool_items`. Note this changes the
  tool's original "no persistence" design (see
  `tools/ballyx-invoice-tool/README.md`, which still describes the
  stateless, redistributable version — that copy is untouched).
- **Hosting dashboard** (`/dashboard`) — sites, domains, DNS records,
  backups, activity, billing invoices, and support tickets all read from
  `lib/dashboard-data.ts` instead of the old `lib/dashboard-mock.ts`. It's
  still one shared demo dataset, not per-account data — see the TODO
  below on dashboard auth. Interactive demo actions that were always
  explicitly ephemeral (domain toggles, "create backup", "submit ticket",
  settings form) still only update client-side state and are not written
  back to Postgres.
- **Sign-up / sign-in** — `users`, `email_verification_tokens`, and
  `rate_limits` (see the Sign-up / sign-in section above).

### Security

- Security headers + a CSP are set in [`next.config.ts`](next.config.ts):
  HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, and a CSP scoped to `'self'`.
- The CSP allows `'unsafe-eval'` in `script-src` — this was **not** a
  default/lazy choice. Framer Motion's `whileInView` scroll-reveal
  animations were tested and confirmed to silently fail (content stuck at
  `opacity: 0`, no visible error) without it. The reasoning is documented
  in a comment directly above the CSP in `next.config.ts`.
- `/signup`, `/signin`, and `/auth/confirm` get their own, stricter CSP
  (no `unsafe-eval`) via a separate `headers()` entry in `next.config.ts`
  — those pages have no scroll-reveal animations and collect credentials,
  so it's worth the extra header block. The two `headers()` entries use
  mutually exclusive `source` patterns (a negative lookahead on the
  catch-all) so exactly one ever matches a given path, rather than
  relying on same-key header-merge precedence between two overlapping
  entries.
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

**Hosting (`lib/site-config.ts`)**
- [ ] `hosting.status` / `hosting.statusDisplay` — current real status
- [ ] `hosting.pricing` / `hosting.pricingDisplay` — real pricing once decided
- [ ] `hosting.plans[].price` — real prices for Starter/Standard/Pro once set
- [ ] `hosting.guarantees` — real uptime SLA % and money-back policy
      (currently `{{HOSTING_UPTIME_SLA}}` / `{{HOSTING_MONEY_BACK_POLICY}}`)
- [ ] `/dashboard/*` and `/tools/invoice/*` are gated by a single shared
      admin session (`lib/auth/session.ts` + `middleware.ts`,
      `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH`/`SESSION_SECRET` in
      `.env.local`), not real per-account/customer auth. Dashboard data
      (sites, domains, DNS records, invoices, backups, activity, support
      tickets) comes from Postgres via `lib/dashboard-data.ts`, but it's
      still one shared illustrative dataset, not per-customer data, and
      none of it is connected to real infrastructure. It's excluded from
      the sitemap and disallowed in `robots.ts`. Give `dashboard_*` tables
      a real account/customer relationship before promoting this beyond
      a demo, and update the "Demo preview" badges/copy once it's real.
      Real email/password accounts now exist (`/signup`, `/signin`, see
      the Sign-up / sign-in section above) but are deliberately kept
      separate from this admin gate — wire `/dashboard` up to per-account
      access via those `users` rows when there's an actual reason for
      public accounts to reach it (e.g. Pluto licensing).
- [ ] `dashboard_invoices.amount` (seeded in `db/seed.sql`) — currently
      `{{INVOICE_AMOUNT}}` placeholders

**Downloads (`lib/downloads.ts`)**
- [ ] Every app's `version`, `releaseDate`, and `fileSize` are
      placeholders — including Pluto's, since none of these are
      confirmed anywhere yet. Mars and Venus additionally need a real
      `tagline`, `description`, and `platforms` list — nothing about
      what these two apps are is defined elsewhere in the codebase.
- [ ] All three apps have `downloadReady: false`, so the Download
      button renders as a disabled "Coming soon" state — there are no
      real installer files in the repo. Once a real installer is
      hosted, set `downloadReady: true` and `downloadUrl` to a real
      file/URL for that app.
- [ ] App icons live in `public/images/app-icons/` (moved from the
      untracked `App Icons/` folder at the repo root during setup).
- [ ] `/downloads/mars` and `/downloads/venus` render illustrative mockup
      screenshots (`public/images/screenshots/mars-*.svg` /
      `venus-*.svg`) and an honest "coming soon" placeholder instead of
      real user testimonials — same convention as
      `components/sections/home/testimonials-placeholder.tsx`. Replace
      both once real screenshots/feedback exist; don't fabricate either
      in the meantime.
- [ ] `/downloads/pluto` redirects to `/product` rather than duplicating
      Pluto's marketing page — `/product` now also has a
      `TestimonialsPlaceholder` section for the same reason.

**Projects (`lib/projects.ts`)**
- [ ] Every entry's `category`, `description`, `services`, and `year` are
      placeholders — fill in the real one-liners for each client project
      (e.g. Ballylike, Kumfence).
- [ ] Add any additional client projects beyond the two seeded here.

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
