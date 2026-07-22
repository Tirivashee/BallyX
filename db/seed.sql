-- Illustrative demo data for the hosting dashboard preview. Mirrors what
-- used to live in lib/dashboard-mock.ts. Fictitious placeholders only —
-- never real client data. Run with `npm run db:seed` (safe to re-run).

TRUNCATE dashboard_sites, dashboard_domains, dashboard_dns_records,
  dashboard_backups, dashboard_activity, dashboard_invoices,
  dashboard_tickets, dashboard_ticket_messages
  RESTART IDENTITY CASCADE;

INSERT INTO dashboard_sites (id, name, domain, status, plan, last_deploy, sort_order) VALUES
  ('site-1', 'Example Storefront', 'shop.example.com', 'Live', 'Standard', '2 hours ago', 1),
  ('site-2', 'Client Portal Demo', 'portal.example.com', 'Live', 'Pro', '1 day ago', 2),
  ('site-3', 'Marketing Preview', 'preview.example.com', 'Building', 'Standard', 'Just now', 3),
  ('site-4', 'Internal Ops Tool', 'ops.example.com', 'Live', 'Pro', '3 days ago', 4),
  ('site-5', 'Staging — Client Portal', 'staging.portal.example.com', 'Paused', 'Standard', '2 weeks ago', 5);

INSERT INTO dashboard_domains (domain, status, registrar, registered_on, expires_on, auto_renew, privacy_protection, locked, nameservers, ssl, sort_order) VALUES
  ('example.com', 'Active', 'BallyX Hosting', '12 Mar 2023', '12 Mar 2027', true, true, true, ARRAY['ns1.ballyxhosting.com','ns2.ballyxhosting.com'], 'Valid — auto-renews', 1),
  ('shop.example.com', 'Active', 'BallyX Hosting', '2 Jun 2024', '2 Jun 2026', true, false, true, ARRAY['ns1.ballyxhosting.com','ns2.ballyxhosting.com'], 'Valid — auto-renews', 2),
  ('portal.example.com', 'Pending', 'BallyX Hosting', '18 Jul 2026', '18 Jul 2027', false, true, false, ARRAY['ns1.ballyxhosting.com','ns2.ballyxhosting.com'], 'Awaiting DNS verification', 3),
  ('ops.example.com', 'Active', 'BallyX Hosting', '9 Sep 2025', '9 Sep 2026', true, true, true, ARRAY['ns1.ballyxhosting.com','ns2.ballyxhosting.com'], 'Valid — auto-renews', 4);

INSERT INTO dashboard_dns_records (id, domain, type, name, value, ttl, sort_order) VALUES
  ('r1-example', 'example.com', 'A', '@', '76.76.21.21', '3600', 1),
  ('r2-example', 'example.com', 'CNAME', 'www', 'example.com', '3600', 2),
  ('r3-example', 'example.com', 'MX', '@', '10 mail.example.com', '3600', 3),
  ('r4-example', 'example.com', 'TXT', '@', '"v=spf1 include:_spf.example.com ~all"', '3600', 4),
  ('r1-shop', 'shop.example.com', 'A', '@', '76.76.21.21', '3600', 1),
  ('r2-shop', 'shop.example.com', 'CNAME', 'www', 'shop.example.com', '3600', 2),
  ('r1-portal', 'portal.example.com', 'CNAME', '@', 'cname.ballyxhosting.com', '3600', 1),
  ('r1-ops', 'ops.example.com', 'A', '@', '76.76.21.22', '3600', 1),
  ('r2-ops', 'ops.example.com', 'TXT', '@', '"v=spf1 include:_spf.example.com ~all"', '3600', 2);

INSERT INTO dashboard_backups (id, site, created_at, size, type, sort_order) VALUES
  ('bk-1', 'Example Storefront', 'Today, 03:00', '412 MB', 'Automatic', 1),
  ('bk-2', 'Client Portal Demo', 'Today, 03:00', '268 MB', 'Automatic', 2),
  ('bk-3', 'Example Storefront', 'Yesterday, 03:00', '410 MB', 'Automatic', 3),
  ('bk-4', 'Internal Ops Tool', '3 days ago, 14:12', '1.1 GB', 'Manual', 4);

INSERT INTO dashboard_activity (id, timestamp, actor, action, detail, sort_order) VALUES
  ('act-1', 'Today, 09:14', 'You', 'Signed in', 'Dashboard preview session started.', 1),
  ('act-2', 'Today, 03:00', 'System', 'Automatic backup completed', 'Example Storefront — 412 MB.', 2),
  ('act-3', 'Yesterday, 16:42', 'BallyX team', 'Deployed update', 'Marketing Preview — new build published.', 3),
  ('act-4', '3 days ago', 'BallyX team', 'Created manual backup', 'Internal Ops Tool — before a schema change.', 4),
  ('act-5', '5 days ago', 'You', 'Updated DNS record', 'Added a TXT record on ops.example.com.', 5);

INSERT INTO dashboard_invoices (id, date, description, amount, status, sort_order) VALUES
  ('INV-2026-0007', '1 Jul 2026', 'Standard hosting — July 2026', '{{INVOICE_AMOUNT}}', 'Paid', 1),
  ('INV-2026-0006', '1 Jun 2026', 'Standard hosting — June 2026', '{{INVOICE_AMOUNT}}', 'Paid', 2),
  ('INV-2026-0005', '1 May 2026', 'Standard hosting — May 2026', '{{INVOICE_AMOUNT}}', 'Paid', 3),
  ('INV-2026-0008', '1 Aug 2026', 'Standard hosting — August 2026', '{{INVOICE_AMOUNT}}', 'Due', 4);

INSERT INTO dashboard_tickets (id, subject, status, created_at, last_update, sort_order) VALUES
  ('TCK-0014', 'SSL certificate renewal question', 'Open', '2 days ago', '1 day ago', 1),
  ('TCK-0009', 'Requesting a manual backup before a migration', 'Closed', '3 weeks ago', '3 weeks ago', 2);

INSERT INTO dashboard_ticket_messages (ticket_id, from_actor, body, at, sort_order) VALUES
  ('TCK-0014', 'You', 'Does the SSL cert on shop.example.com renew automatically?', '2 days ago', 1),
  ('TCK-0014', 'BallyX Support', 'Yes — it auto-renews about 30 days before expiry, no action needed.', '1 day ago', 2),
  ('TCK-0009', 'You', 'Could you take a manual backup of Internal Ops Tool before we migrate data?', '3 weeks ago', 1),
  ('TCK-0009', 'BallyX Support', 'Done — backup created and listed under Backups.', '3 weeks ago', 2);

-- ---------------------------------------------------------------------
-- Invoice tool defaults — real BallyX details (not illustrative demo
-- data), seeded once so the tool works before anyone visits Settings.
-- ON CONFLICT DO NOTHING so re-running this never overwrites an admin
-- edit made through /tools/invoice/settings.
-- ---------------------------------------------------------------------
INSERT INTO invoice_tool_settings
  (id, from_company, from_name, from_role, from_email, from_phone, payment_methods, notes)
VALUES (
  1,
  'BallyX',
  'Tirivashe Chitanda',
  'Software Engineer',
  'tirivashee@gmail.com',
  '+263 78 395 2546',
  'EcoCash: 0783 952 546 (Tirivashe Chitanda)
Send proof of payment to tirivashee@gmail.com.',
  'Payment due within 7 days of issue.
Thank you for choosing BallyX.'
)
ON CONFLICT (id) DO NOTHING;
