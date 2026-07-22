import React from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/lib/invoice/InvoiceDocument";
import type { InvoiceData, LineItem, Party } from "@/lib/invoice/types";

// @react-pdf/renderer needs the Node runtime (it is not Edge-compatible).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// This is a public, unauthenticated endpoint that does server-side rendering
// work per request, so inputs are capped defensively against abuse.
const MAX_ITEMS = 100;
const MAX_SHORT = 300;
const MAX_LONG = 4000;

const str = (v: unknown, max = MAX_SHORT): string =>
  typeof v === "string" ? v.slice(0, max) : v == null ? "" : String(v).slice(0, max);

function party(raw: unknown): Party {
  const p = (raw ?? {}) as Partial<Party>;
  return {
    company: str(p.company),
    name: str(p.name),
    role: str(p.role),
    email: str(p.email),
    phone: str(p.phone),
    addressLines: Array.isArray(p.addressLines)
      ? p.addressLines.slice(0, 20).map((l) => str(l))
      : [],
  };
}

/** Coerce + sanitize the client payload into a well-formed, size-capped InvoiceData. */
function normalize(input: unknown): InvoiceData {
  const raw = (input ?? {}) as Partial<InvoiceData>;

  const items: LineItem[] = Array.isArray(raw.items)
    ? raw.items.slice(0, MAX_ITEMS).map((it, i) => ({
        id: str((it as LineItem)?.id ?? `item_${i}`, 64),
        name: str((it as LineItem)?.name),
        description: str((it as LineItem)?.description, MAX_LONG),
        quantity: Math.max(0, Math.min(1_000_000, Math.round(Number((it as LineItem)?.quantity) || 0))),
        unitCents: Math.max(-1_000_000_000, Math.min(1_000_000_000, Math.round(Number((it as LineItem)?.unitCents) || 0))),
      }))
    : [];

  return {
    invoiceNo: str(raw.invoiceNo ?? "BX-INV", 64),
    dateIssued: str(raw.dateIssued, 32),
    dueDate: str(raw.dueDate, 32),
    currency: str(raw.currency ?? "USD", 8),
    currencySymbol: str(raw.currencySymbol ?? "$", 8),
    from: party(raw.from),
    billTo: party(raw.billTo),
    items,
    discountCents: Math.max(-1_000_000_000, Math.min(1_000_000_000, Math.round(Number(raw.discountCents) || 0))),
    recurringNote: str(raw.recurringNote, MAX_LONG),
    paymentMethods: str(raw.paymentMethods, MAX_LONG),
    notes: str(raw.notes, MAX_LONG),
  };
}

function safeFilename(invoiceNo: string): string {
  const base = invoiceNo.replace(/[^a-z0-9._-]+/gi, "_").replace(/^_+|_+$/g, "");
  return `${base || "invoice"}.pdf`;
}

export async function POST(req: Request) {
  let data: InvoiceData;
  try {
    data = normalize(await req.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (data.items.length === 0) {
    return new Response(
      JSON.stringify({ error: "At least one line item is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const element = React.createElement(InvoiceDocument, {
      data,
    }) as unknown as React.ReactElement<DocumentProps>;
    const buffer = await renderToBuffer(element);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename(data.invoiceNo)}"`,
        "Cache-Control": "no-store",
        "Content-Length": String(buffer.length),
      },
    });
  } catch (err) {
    console.error("Invoice PDF generation failed:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
