import { query } from "@/lib/db";

/**
 * Data access for the hosting dashboard preview. Backed by real Postgres
 * tables (see db/schema.sql + db/seed.sql). Access is gated by a single
 * admin session (see lib/auth/session.ts + middleware.ts) rather than
 * per-account auth — everyone who signs in sees the same shared,
 * illustrative demo dataset, not per-customer data.
 *
 * Server-only (imports lib/db, which pulls in the `pg` driver) — client
 * components must not import from here. The one static, non-DB piece of
 * dashboard "data" (the demo user) lives in lib/dashboard-demo-user.ts
 * instead, so client components can use it safely.
 */

export type Site = {
  id: string;
  name: string;
  domain: string;
  status: "Live" | "Building" | "Paused";
  plan: string;
  lastDeploy: string;
};

export type Domain = {
  domain: string;
  status: "Active" | "Pending" | "Expired";
  registrar: string;
  registeredOn: string;
  expiresOn: string;
  autoRenew: boolean;
  privacyProtection: boolean;
  locked: boolean;
  nameservers: string[];
  ssl: string;
};

export type DnsRecord = {
  id: string;
  type: "A" | "CNAME" | "MX" | "TXT" | "NS";
  name: string;
  value: string;
  ttl: string;
};

export type Backup = {
  id: string;
  site: string;
  createdAt: string;
  size: string;
  type: "Automatic" | "Manual";
};

export type ActivityEntry = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  detail: string;
};

export type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Paid" | "Due" | "Overdue";
};

export type Ticket = {
  id: string;
  subject: string;
  status: "Open" | "Closed";
  createdAt: string;
  lastUpdate: string;
  messages: { from: "You" | "BallyX Support"; body: string; at: string }[];
};

export async function getSites(): Promise<Site[]> {
  const rows = await query<{
    id: string;
    name: string;
    domain: string;
    status: Site["status"];
    plan: string;
    last_deploy: string;
  }>(`SELECT id, name, domain, status, plan, last_deploy FROM dashboard_sites ORDER BY sort_order`);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    domain: r.domain,
    status: r.status,
    plan: r.plan,
    lastDeploy: r.last_deploy,
  }));
}

export async function getDomains(): Promise<Domain[]> {
  const rows = await query<{
    domain: string;
    status: Domain["status"];
    registrar: string;
    registered_on: string;
    expires_on: string;
    auto_renew: boolean;
    privacy_protection: boolean;
    locked: boolean;
    nameservers: string[];
    ssl: string;
  }>(
    `SELECT domain, status, registrar, registered_on, expires_on, auto_renew,
            privacy_protection, locked, nameservers, ssl
     FROM dashboard_domains ORDER BY sort_order`,
  );
  return rows.map((r) => ({
    domain: r.domain,
    status: r.status,
    registrar: r.registrar,
    registeredOn: r.registered_on,
    expiresOn: r.expires_on,
    autoRenew: r.auto_renew,
    privacyProtection: r.privacy_protection,
    locked: r.locked,
    nameservers: r.nameservers,
    ssl: r.ssl,
  }));
}

export async function getDomain(domain: string): Promise<Domain | null> {
  const domains = await getDomains();
  return domains.find((d) => d.domain === domain) ?? null;
}

export async function getDnsRecords(domain: string): Promise<DnsRecord[]> {
  const rows = await query<{
    id: string;
    type: DnsRecord["type"];
    name: string;
    value: string;
    ttl: string;
  }>(
    `SELECT id, type, name, value, ttl FROM dashboard_dns_records
     WHERE domain = $1 ORDER BY sort_order`,
    [domain],
  );
  return rows;
}

export async function getBackups(): Promise<Backup[]> {
  const rows = await query<{
    id: string;
    site: string;
    created_at: string;
    size: string;
    type: Backup["type"];
  }>(`SELECT id, site, created_at, size, type FROM dashboard_backups ORDER BY sort_order`);
  return rows.map((r) => ({
    id: r.id,
    site: r.site,
    createdAt: r.created_at,
    size: r.size,
    type: r.type,
  }));
}

export async function getActivity(): Promise<ActivityEntry[]> {
  return query<ActivityEntry>(
    `SELECT id, timestamp, actor, action, detail FROM dashboard_activity ORDER BY sort_order`,
  );
}

export async function getInvoices(): Promise<Invoice[]> {
  return query<Invoice>(
    `SELECT id, date, description, amount, status FROM dashboard_invoices ORDER BY sort_order`,
  );
}

export async function getTickets(): Promise<Ticket[]> {
  const tickets = await query<{
    id: string;
    subject: string;
    status: Ticket["status"];
    created_at: string;
    last_update: string;
  }>(`SELECT id, subject, status, created_at, last_update FROM dashboard_tickets ORDER BY sort_order`);

  const messages = await query<{
    ticket_id: string;
    from_actor: Ticket["messages"][number]["from"];
    body: string;
    at: string;
  }>(
    `SELECT ticket_id, from_actor, body, at FROM dashboard_ticket_messages ORDER BY sort_order`,
  );

  return tickets.map((t) => ({
    id: t.id,
    subject: t.subject,
    status: t.status,
    createdAt: t.created_at,
    lastUpdate: t.last_update,
    messages: messages
      .filter((m) => m.ticket_id === t.id)
      .map((m) => ({ from: m.from_actor, body: m.body, at: m.at })),
  }));
}

/**
 * Illustrative headline stats. "Sites hosted" is a real count from
 * dashboard_sites; uptime/SSL/storage aren't tracked anywhere yet (there's
 * no real infrastructure behind this preview), so those stay as static
 * illustrative figures.
 */
export async function getStats(): Promise<{ label: string; value: string }[]> {
  const sites = await getSites();
  return [
    { label: "Sites hosted", value: String(sites.length) },
    { label: "Uptime (30d)", value: "99.98%" },
    { label: "SSL certificates", value: `${sites.length} active` },
    { label: "Storage used", value: "9.6 GB / 40 GB" },
  ];
}
