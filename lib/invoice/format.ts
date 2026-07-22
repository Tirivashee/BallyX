// Pure formatting + math helpers. Safe on client and server.
import type { InvoiceData, LineItem } from "./types";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Format cents as a currency string, e.g. formatMoney(1500) -> "$15.00". Negative values render as "-$15.00", not "$-15.00". */
export function formatMoney(cents: number, symbol = "$"): string {
  const safe = Number.isFinite(cents) ? cents : 0;
  const sign = safe < 0 ? "-" : "";
  const value = (Math.abs(safe) / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}${symbol}${value}`;
}

/** Convert a dollars string/number to integer cents. "15.5" -> 1550. */
export function toCents(dollars: string | number): number {
  const n = typeof dollars === "string" ? parseFloat(dollars) : dollars;
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

/** Convert cents to a dollars number for editable inputs. 1550 -> 15.5 */
export function toDollars(cents: number): number {
  return Number.isFinite(cents) ? cents / 100 : 0;
}

/** Format an ISO date (yyyy-mm-dd) as "22 Jul 2026". Falls back gracefully. */
export function formatDate(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || "";
  const [y, m, d] = iso.split("-").map(Number);
  const month = MONTHS[m - 1] ?? "";
  return `${String(d).padStart(2, "0")} ${month} ${y}`;
}

/** Split a newline-separated block into non-blank, trimmed-of-edges lines. */
export function textLines(value?: string): string[] {
  return (value || "").split("\n").filter((l) => l.trim().length > 0);
}

export const lineTotalCents = (it: LineItem): number =>
  (Number(it.quantity) || 0) * (Number(it.unitCents) || 0);

export const subtotalCents = (items: LineItem[]): number =>
  items.reduce((sum, it) => sum + lineTotalCents(it), 0);

export const totalCents = (data: InvoiceData): number =>
  subtotalCents(data.items) - (data.discountCents || 0);
