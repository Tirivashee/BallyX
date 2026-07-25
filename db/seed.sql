-- ---------------------------------------------------------------------
-- Invoice tool defaults — real BallyX details (not illustrative demo
-- data), seeded once so the tool works before anyone visits Settings.
-- ON CONFLICT DO NOTHING so re-running this never overwrites an admin
-- edit made through /dashboard/invoice/settings.
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
