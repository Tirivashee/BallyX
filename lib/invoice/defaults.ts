import type { InvoiceData } from "./types";
import type { InvoiceSettings } from "./invoice-data";

/** yyyy-mm-dd for `n` days from today (local time). */
function isoOffset(days = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Simple invoice number, e.g. BX-INV-260722-1. Tweak to taste. */
export function nextInvoiceNo(seq = 1): string {
  const d = new Date();
  const stamp =
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  return `BX-INV-${stamp}-${seq}`;
}

let _id = 0;
export const newItemId = (): string => `item_${Date.now().toString(36)}_${_id++}`;

/**
 * A prefilled invoice, ready to edit. Pass the DB-backed settings (see
 * lib/invoice/invoice-data.ts) to use the admin-edited From/payment/notes;
 * omit it (or pass null, e.g. before Settings has ever been saved) to fall
 * back to these hardcoded BallyX defaults.
 */
export function makeDefaultInvoice(settings?: InvoiceSettings | null): InvoiceData {
  return {
    invoiceNo: nextInvoiceNo(1),
    dateIssued: isoOffset(0),
    dueDate: isoOffset(7),
    currency: "USD",
    currencySymbol: "$",
    from: {
      company: settings?.fromCompany || "BallyX",
      name: settings?.fromName || "Tirivashe Chitanda",
      role: settings?.fromRole || "Software Engineer",
      email: settings?.fromEmail || "tirivashee@gmail.com",
      phone: settings?.fromPhone || "+263 78 395 2546",
    },
    billTo: {
      name: "",
      addressLines: [],
    },
    items: [
      { id: newItemId(), name: "", description: "", quantity: 1, unitCents: 0 },
    ],
    discountCents: 0,
    recurringNote: "",
    paymentMethods:
      settings?.paymentMethods ||
      "EcoCash: 0783 952 546 (Tirivashe Chitanda)\nSend proof of payment to tirivashee@gmail.com.",
    notes:
      settings?.notes ||
      "Payment due within 7 days of issue.\nThank you for choosing BallyX.",
  };
}
