"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { query } from "@/lib/db";
import { toCents } from "@/lib/invoice/format";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const SettingsSchema = z.object({
  fromCompany: z.string().trim().max(200),
  fromName: z.string().trim().max(200),
  fromRole: z.string().trim().max(200),
  fromEmail: z.string().trim().max(200),
  fromPhone: z.string().trim().max(50),
  paymentMethods: z.string().trim().max(4000),
  notes: z.string().trim().max(4000),
});

export async function updateInvoiceSettings(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = SettingsSchema.safeParse({
    fromCompany: formData.get("fromCompany"),
    fromName: formData.get("fromName"),
    fromRole: formData.get("fromRole"),
    fromEmail: formData.get("fromEmail"),
    fromPhone: formData.get("fromPhone"),
    paymentMethods: formData.get("paymentMethods"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields." };
  }
  const d = parsed.data;

  try {
    await query(
      `INSERT INTO invoice_tool_settings
         (id, from_company, from_name, from_role, from_email, from_phone, payment_methods, notes, updated_at)
       VALUES (1, $1, $2, $3, $4, $5, $6, $7, now())
       ON CONFLICT (id) DO UPDATE SET
         from_company = EXCLUDED.from_company,
         from_name = EXCLUDED.from_name,
         from_role = EXCLUDED.from_role,
         from_email = EXCLUDED.from_email,
         from_phone = EXCLUDED.from_phone,
         payment_methods = EXCLUDED.payment_methods,
         notes = EXCLUDED.notes,
         updated_at = now()`,
      [d.fromCompany, d.fromName, d.fromRole, d.fromEmail, d.fromPhone, d.paymentMethods, d.notes]
    );
  } catch (err) {
    console.error("Failed to save invoice settings:", err);
    return { status: "error", message: "Could not save settings. Try again." };
  }

  revalidatePath("/dashboard/invoice");
  revalidatePath("/dashboard/invoice/settings");
  return { status: "success", message: "Settings saved." };
}

const SavedItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(300),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  unit: z.string().trim().min(1, "Unit price is required."),
});

export async function addSavedItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = SavedItemSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    unit: formData.get("unit"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the highlighted fields.",
    };
  }
  const { name, description, unit } = parsed.data;
  const unitCents = toCents(unit);

  try {
    await query(
      `INSERT INTO invoice_tool_saved_items (name, description, unit_cents, sort_order)
       VALUES ($1, $2, $3, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM invoice_tool_saved_items))`,
      [name, description || null, unitCents]
    );
  } catch (err) {
    console.error("Failed to save item:", err);
    return { status: "error", message: "Could not save the item. Try again." };
  }

  revalidatePath("/dashboard/invoice");
  revalidatePath("/dashboard/invoice/settings");
  return { status: "success", message: "Item saved." };
}

export async function deleteSavedItem(id: number): Promise<void> {
  await query(`DELETE FROM invoice_tool_saved_items WHERE id = $1`, [id]);
  revalidatePath("/dashboard/invoice");
  revalidatePath("/dashboard/invoice/settings");
}
