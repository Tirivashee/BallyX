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
-- Hosting dashboard (/dashboard) — single shared demo dataset.
-- Access is gated by one shared admin session (see lib/auth/session.ts +
-- middleware.ts), not per-account auth, so these tables hold one
-- illustrative dataset rather than per-user rows.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dashboard_sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Live', 'Building', 'Paused')),
  plan TEXT NOT NULL,
  last_deploy TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS dashboard_domains (
  domain TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Pending', 'Expired')),
  registrar TEXT NOT NULL,
  registered_on TEXT NOT NULL,
  expires_on TEXT NOT NULL,
  auto_renew BOOLEAN NOT NULL DEFAULT true,
  privacy_protection BOOLEAN NOT NULL DEFAULT true,
  locked BOOLEAN NOT NULL DEFAULT true,
  nameservers TEXT[] NOT NULL DEFAULT '{}',
  ssl TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS dashboard_dns_records (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL REFERENCES dashboard_domains(domain) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('A', 'CNAME', 'MX', 'TXT', 'NS')),
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  ttl TEXT NOT NULL DEFAULT '3600',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_dashboard_dns_records_domain
  ON dashboard_dns_records(domain);

CREATE TABLE IF NOT EXISTS dashboard_backups (
  id TEXT PRIMARY KEY,
  site TEXT NOT NULL,
  created_at TEXT NOT NULL,
  size TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Automatic', 'Manual')),
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS dashboard_activity (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  detail TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS dashboard_invoices (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  amount TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Paid', 'Due', 'Overdue')),
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS dashboard_tickets (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Open', 'Closed')),
  created_at TEXT NOT NULL,
  last_update TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS dashboard_ticket_messages (
  id SERIAL PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES dashboard_tickets(id) ON DELETE CASCADE,
  from_actor TEXT NOT NULL CHECK (from_actor IN ('You', 'BallyX Support')),
  body TEXT NOT NULL,
  at TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_dashboard_ticket_messages_ticket_id
  ON dashboard_ticket_messages(ticket_id);
