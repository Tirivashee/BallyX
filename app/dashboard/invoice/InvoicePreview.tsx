"use client";

import React from "react";
import type { InvoiceData } from "@/lib/invoice/types";
import { THEME } from "@/lib/invoice/theme";
import { BALLYX_LOGO } from "@/lib/invoice/logo";
import {
  formatMoney,
  formatDate,
  subtotalCents,
  lineTotalCents,
  textLines,
} from "@/lib/invoice/format";

/**
 * On-screen mirror of the generated PDF. Uses inline styles + the shared THEME
 * tokens so it looks the same as InvoiceDocument.tsx without depending on the
 * host app's CSS. The PDF from the API is the source of truth for the final file.
 */
export function InvoicePreview({ data }: { data: InvoiceData }) {
  const sym = data.currencySymbol || "$";
  const sub = subtotalCents(data.items);
  const total = sub - (data.discountCents || 0);
  const addressLines = textLines((data.billTo.addressLines || []).join("\n"));

  const label: React.CSSProperties = {
    fontSize: 8.5,
    color: THEME.accent,
    fontWeight: 800,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    margin: "0 0 5px",
  };

  return (
    <div
      style={{
        background: THEME.paper,
        color: THEME.text,
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        padding: "38px 42px",
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: 10.5,
        lineHeight: 1.45,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: `3px solid ${THEME.ink}`,
          paddingBottom: 18,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BALLYX_LOGO} alt="BallyX" style={{ height: 36, width: "auto" }} />
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 4,
              color: THEME.ink,
              lineHeight: 1,
            }}
          >
            INVOICE
          </div>
          <div style={{ marginTop: 8, fontSize: 10.5, color: THEME.muted, letterSpacing: 1 }}>
            {data.invoiceNo}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
        <div style={{ flex: 1 }}>
          <div style={label}>From</div>
          <div style={{ fontWeight: 700, fontSize: 12, color: THEME.ink }}>
            {data.from.company}
          </div>
          {data.from.name && <div style={{ color: "#444" }}>{data.from.name}</div>}
          {data.from.role && <div style={{ color: "#444" }}>{data.from.role}</div>}
          {data.from.email && <div style={{ color: "#444" }}>{data.from.email}</div>}
          {data.from.phone && <div style={{ color: "#444" }}>{data.from.phone}</div>}
        </div>

        <div style={{ flex: 1 }}>
          <div style={label}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: 12, color: THEME.ink }}>
            {data.billTo.name || "—"}
          </div>
          {addressLines.map((l, i) => (
            <div key={i} style={{ color: "#444" }}>{l}</div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <div style={label}>Details</div>
          {[
            ["Invoice No.", data.invoiceNo],
            ["Date Issued", formatDate(data.dateIssued)],
            ["Due Date", formatDate(data.dueDate)],
            ["Currency", data.currency],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ color: THEME.headHint }}>{k}</span>
              <span style={{ fontWeight: 700, color: THEME.ink }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div style={{ display: "flex", background: THEME.ink, marginTop: 22 }}>
        {(
          [
            { label: "Description", style: { flex: 1, textAlign: "left" } },
            { label: "Qty", style: { width: 46, textAlign: "right" } },
            { label: "Unit", style: { width: 72, textAlign: "right" } },
            { label: "Amount", style: { width: 80, textAlign: "right" } },
          ] as { label: string; style: React.CSSProperties }[]
        ).map((col) => (
          <div
            key={col.label}
            style={{
              color: "#fff",
              fontSize: 8.5,
              letterSpacing: 1.1,
              textTransform: "uppercase",
              padding: "9px 12px",
              ...col.style,
            }}
          >
            {col.label}
          </div>
        ))}
      </div>

      {data.items.map((it, i) => (
        <div
          key={it.id || i}
          style={{
            display: "flex",
            borderBottom: `1px solid ${THEME.border}`,
            padding: "10px 12px",
          }}
        >
          <div style={{ flex: 1, paddingRight: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 11, color: THEME.ink }}>
              {it.name || "—"}
            </div>
            {it.description && (
              <div style={{ color: THEME.muted, fontSize: 9.5, marginTop: 3 }}>
                {it.description}
              </div>
            )}
          </div>
          <div style={{ width: 46, textAlign: "right" }}>{it.quantity}</div>
          <div style={{ width: 72, textAlign: "right" }}>{formatMoney(it.unitCents, sym)}</div>
          <div style={{ width: 80, textAlign: "right", fontWeight: 700 }}>
            {formatMoney(lineTotalCents(it), sym)}
          </div>
        </div>
      ))}

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <div style={{ width: 240 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 4px" }}>
            <span style={{ color: THEME.headHint }}>Subtotal</span>
            <span style={{ fontWeight: 700, color: THEME.ink }}>{formatMoney(sub, sym)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 4px" }}>
            <span style={{ color: THEME.headHint }}>Discount</span>
            <span style={{ fontWeight: 700, color: THEME.ink }}>
              {formatMoney(data.discountCents || 0, sym)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: `2px solid ${THEME.ink}`,
              marginTop: 4,
              paddingTop: 9,
              padding: "9px 4px 0",
            }}
          >
            <span style={{ fontWeight: 800, fontSize: 14, color: THEME.ink }}>Total Due</span>
            <span style={{ fontWeight: 800, fontSize: 14, color: THEME.accent }}>
              {formatMoney(total, sym)}
            </span>
          </div>
        </div>
      </div>

      {/* Callout */}
      {data.recurringNote && data.recurringNote.trim() && (
        <div
          style={{
            marginTop: 16,
            borderLeft: `3px solid ${THEME.accent}`,
            background: THEME.accentSoft,
            padding: "9px 14px",
            borderRadius: "0 6px 6px 0",
          }}
        >
          <div style={label}>Ongoing</div>
          <div style={{ color: "#444", fontSize: 10 }}>{data.recurringNote}</div>
        </div>
      )}

      {/* Info grid */}
      <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={label}>Payment Methods</div>
          {textLines(data.paymentMethods).map((l, i) => (
            <div key={i} style={{ color: "#444", marginBottom: 2 }}>{l}</div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={label}>Notes</div>
          {textLines(data.notes).map((l, i) => (
            <div key={i} style={{ color: "#444", marginBottom: 2 }}>{l}</div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 18,
          borderTop: `1px solid ${THEME.line}`,
          paddingTop: 12,
          textAlign: "center",
          color: THEME.faint,
          fontSize: 9,
          letterSpacing: 0.4,
        }}
      >
        <span style={{ color: THEME.ink, fontWeight: 700 }}>
          Bally<span style={{ color: THEME.accent }}>X</span>
        </span>
        {"  •  Software & Web Solutions  •  "}
        {data.from.email}
        {"  •  "}
        {data.from.phone}
      </div>
    </div>
  );
}

export default InvoicePreview;
