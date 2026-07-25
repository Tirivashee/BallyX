-- BallyX website schema. Run with `npm run db:migrate`.
-- All statements are idempotent (IF NOT EXISTS) so this can be re-run safely.

-- ---------------------------------------------------------------------
-- Contact form
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Invoice tool (/tools/invoice) — one row per generated PDF
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoice_tool_invoices (
  id SERIAL PRIMARY KEY,
  invoice_no TEXT NOT NULL,
  date_issued TEXT,
  due_date TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  currency_symbol TEXT NOT NULL DEFAULT '$',
  from_party JSONB NOT NULL,
  bill_to JSONB NOT NULL,
  discount_cents INTEGER NOT NULL DEFAULT 0,
  recurring_note TEXT,
  payment_methods TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoice_tool_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL REFERENCES invoice_tool_invoices(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL,
  unit_cents INTEGER NOT NULL,
  position INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invoice_tool_items_invoice_id
  ON invoice_tool_items(invoice_id);

-- Reusable "Bill To" directory. Upserted (by name) every time an invoice is
-- generated, so previously-billed customers can be picked from a dropdown
-- instead of retyped.
CREATE TABLE IF NOT EXISTS invoice_tool_customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  address_lines TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Editable sender/business defaults for the invoice tool — a single row
-- (id is always 1). Replaces the hardcoded values in lib/invoice/defaults.ts
-- once an admin has saved settings at least once.
CREATE TABLE IF NOT EXISTS invoice_tool_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  from_company TEXT NOT NULL DEFAULT '',
  from_name TEXT NOT NULL DEFAULT '',
  from_role TEXT NOT NULL DEFAULT '',
  from_email TEXT NOT NULL DEFAULT '',
  from_phone TEXT NOT NULL DEFAULT '',
  payment_methods TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A small reusable price list — line items billed often, inserted into a
-- new invoice with one click instead of retyped every time.
CREATE TABLE IF NOT EXISTS invoice_tool_saved_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  unit_cents INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- The hosting-ops demo dashboard (Sites/Domains/Backups/Activity/Billing/
-- Support) and the "BallyX Hosting" product it previewed have both been
-- removed — /dashboard is now the apps/blog/newsletter/invoice admin
-- console instead. Drop the illustrative tables that backed it.
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS
  dashboard_ticket_messages,
  dashboard_tickets,
  dashboard_invoices,
  dashboard_activity,
  dashboard_backups,
  dashboard_dns_records,
  dashboard_domains,
  dashboard_sites;

-- ---------------------------------------------------------------------
-- Email/password accounts (signup/signin/confirm) — separate from the
-- single shared admin account in ADMIN_USERNAME/ADMIN_PASSWORD_HASH.
-- A confirmed user session is NOT admin: middleware.ts still requires
-- sub = 'admin' for /dashboard, so this table only unlocks /account
-- (profile, avatar, newsletter opt-in, delete account), never /dashboard.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE CHECK (email = lower(email)),
  password_hash TEXT NOT NULL,
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  -- TODO(licensing): a `licenses` table will reference users(id) once
  -- Pluto licensing is wired up.
);

-- Added for the /account area + newsletter sending. ADD COLUMN IF NOT
-- EXISTS (not folded into the CREATE TABLE above) since this file is
-- re-run against an already-existing users table.
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_key TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS newsletter_subscribed BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS newsletter_unsubscribed_at TIMESTAMPTZ;
-- "Delete my account" is a soft-delete/anonymize (see lib/actions/account.ts):
-- email is scrambled and freed up for re-signup, password_hash cleared so
-- sign-in can never succeed again, but the row stays so newsletter send
-- history keeps referential integrity. Every user-facing read of this
-- table (sign-in, /account, getCurrentUser) must filter deleted_at IS NULL.
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Raw tokens exist only in the confirmation email; only their sha256
-- hash is ever stored, as a bytea so lookups hit the primary key index
-- directly rather than a string compare.
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  token_hash BYTEA PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id
  ON email_verification_tokens(user_id);

-- Fixed-window rate limiting for signup/signin/confirm, keyed by e.g.
-- 'signup:ip:1.2.3.4' or 'signup:email:someone@example.com'. Updated via
-- a single atomic UPSERT (see lib/auth/rate-limit.ts) so concurrent
-- requests can't race past a read-then-increment.
-- TODO(cleanup): rows are never evicted. Fine at this site's scale; add
-- a periodic delete of old window_start rows if this table grows large.
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket_key TEXT PRIMARY KEY,
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------
-- Admin-managed apps catalog (/dashboard/apps). Additive to the static
-- Pluto/Mars/Venus entries in lib/downloads.ts, not a replacement — see
-- that file's header comment. /downloads merges both sources by slug.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS apps (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon_url TEXT,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  version TEXT NOT NULL DEFAULT '',
  release_date TEXT NOT NULL DEFAULT '',
  platforms TEXT[] NOT NULL DEFAULT '{}',
  delivery_type TEXT NOT NULL DEFAULT 'desktop' CHECK (delivery_type IN ('desktop', 'cloud')),
  file_size TEXT,
  access TEXT,
  download_ready BOOLEAN NOT NULL DEFAULT false,
  download_url TEXT,
  -- [{ src, alt, caption }] — src is a plain URL until Vercel Blob is
  -- wired up (see lib/blob.ts), then a Blob URL.
  screenshots JSONB NOT NULL DEFAULT '[]',
  published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Blog (/dashboard/blog admin, /blog + /blog/[slug] public). No author
-- FK — the only writer is the single shared admin identity, which has
-- no row anywhere to reference (see ADMIN_USERNAME/ADMIN_PASSWORD_HASH
-- comment above). content_html is re-sanitized server-side on every
-- write (lib/actions/blog.ts) regardless of what the Tiptap client sent.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  content_html TEXT NOT NULL DEFAULT '',
  author_name TEXT NOT NULL DEFAULT 'BallyX Team',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published_at
  ON blog_posts(status, published_at DESC);

-- ---------------------------------------------------------------------
-- Newsletter / email adverts (/dashboard/newsletter) — reusable
-- templates plus a per-recipient send log, so a partial batch failure
-- is visible and auditable rather than an opaque "sent" checkbox.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL DEFAULT '',
  body_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_sends (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES email_templates(id) ON DELETE SET NULL,
  subject TEXT NOT NULL, -- snapshot at send time, survives template edits/deletes
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'completed', 'failed')),
  total_recipients INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_send_recipients (
  id SERIAL PRIMARY KEY,
  send_id INTEGER NOT NULL REFERENCES newsletter_sends(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL, -- snapshot, survives account deletion/anonymization
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error TEXT,
  sent_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_newsletter_send_recipients_send_id
  ON newsletter_send_recipients(send_id);
