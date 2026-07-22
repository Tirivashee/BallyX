// Shared invoice types. Pure types — safe to import on both client and server.
//
// Money convention: every monetary value is stored as an INTEGER number of
// cents. Never store money as a float. Format for display with formatMoney().

export interface LineItem {
  id: string;
  name: string;
  description?: string;
  /** Whole-number quantity. */
  quantity: number;
  /** Price per unit, in cents (e.g. $15.00 -> 1500). */
  unitCents: number;
}

export interface Party {
  company?: string;
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  /** Free-form address / context lines. */
  addressLines?: string[];
}

export interface InvoiceData {
  invoiceNo: string;
  /** ISO date, yyyy-mm-dd (matches <input type="date">). */
  dateIssued: string;
  dueDate: string;
  /** ISO currency code shown in the "Currency" field, e.g. "USD". */
  currency: string;
  /** Symbol used when rendering amounts, e.g. "$". */
  currencySymbol: string;
  from: Party;
  billTo: Party;
  items: LineItem[];
  /** Flat discount in cents, subtracted from the subtotal. */
  discountCents: number;
  /** Optional highlighted callout (e.g. recurring hosting terms). */
  recurringNote?: string;
  /** Newline-separated lines. */
  paymentMethods?: string;
  /** Newline-separated lines. */
  notes?: string;
}
