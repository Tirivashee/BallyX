import type { InvoiceData } from "./types";

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

/** A prefilled invoice with BallyX's own details, ready to edit. */
export function makeDefaultInvoice(): InvoiceData {
  return {
    invoiceNo: nextInvoiceNo(1),
    dateIssued: isoOffset(0),
    dueDate: isoOffset(7),
    currency: "USD",
    currencySymbol: "$",
    from: {
      company: "BallyX",
      name: "Tirivashe Chitanda",
      role: "Software Engineer",
      email: "tirivashee@gmail.com",
      phone: "+263 78 395 2546",
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
      "EcoCash: 0783 952 546 (Tirivashe Chitanda)\nSend proof of payment to tirivashee@gmail.com.",
    notes:
      "Payment due within 7 days of issue.\nThank you for choosing BallyX.",
  };
}
