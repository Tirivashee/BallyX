import { query } from "@/lib/db";

/**
 * Data access for the invoice tool's DB-backed features (customer
 * directory, business settings, saved line items). Server-only (imports
 * lib/db, which pulls in the `pg` driver) — client components must not
 * import from here.
 */

export type Customer = {
  id: number;
  name: string;
  addressLines: string[];
};

export type InvoiceSettings = {
  fromCompany: string;
  fromName: string;
  fromRole: string;
  fromEmail: string;
  fromPhone: string;
  paymentMethods: string;
  notes: string;
};

export type SavedItem = {
  id: number;
  name: string;
  description: string;
  unitCents: number;
};

export async function getCustomers(): Promise<Customer[]> {
  const rows = await query<{ id: number; name: string; address_lines: string[] }>(
    `SELECT id, name, address_lines FROM invoice_tool_customers ORDER BY last_used_at DESC`
  );
  return rows.map((r) => ({ id: r.id, name: r.name, addressLines: r.address_lines }));
}

export async function getSettings(): Promise<InvoiceSettings | null> {
  const rows = await query<{
    from_company: string;
    from_name: string;
    from_role: string;
    from_email: string;
    from_phone: string;
    payment_methods: string;
    notes: string;
  }>(
    `SELECT from_company, from_name, from_role, from_email, from_phone, payment_methods, notes
     FROM invoice_tool_settings WHERE id = 1`
  );
  const row = rows[0];
  if (!row) return null;
  return {
    fromCompany: row.from_company,
    fromName: row.from_name,
    fromRole: row.from_role,
    fromEmail: row.from_email,
    fromPhone: row.from_phone,
    paymentMethods: row.payment_methods,
    notes: row.notes,
  };
}

export async function getSavedItems(): Promise<SavedItem[]> {
  const rows = await query<{
    id: number;
    name: string;
    description: string | null;
    unit_cents: number;
  }>(
    `SELECT id, name, description, unit_cents FROM invoice_tool_saved_items
     ORDER BY sort_order ASC, id ASC`
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? "",
    unitCents: r.unit_cents,
  }));
}
