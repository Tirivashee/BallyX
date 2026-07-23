// Server-side PDF document. Imported only by the API route, so @react-pdf/renderer
// never ships to the client bundle. Uses the base-14 "Helvetica" font (no font
// files to register) which keeps the output as crisp, selectable vector text.
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { InvoiceData } from "./types";
import { THEME } from "./theme";
import { BALLYX_LOGO } from "./logo";
import {
  formatMoney,
  formatDate,
  subtotalCents,
  lineTotalCents,
  textLines,
} from "./format";

const s = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 36,
    paddingHorizontal: 50,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: THEME.text,
    lineHeight: 1.4,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 3,
    borderBottomColor: THEME.ink,
    paddingBottom: 18,
  },
  logo: { width: 150, height: 34 },
  headerRight: { alignItems: "flex-end" },
  docTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 4,
    color: THEME.ink,
    // Fixed height + lineHeight sidestep a react-pdf bug where bold text
    // with letterSpacing gets measured with ~0 box height, which used to
    // make invNo below render on top of/overlapping this title.
    lineHeight: 1,
    height: 32,
  },
  invNo: { marginTop: 10, fontSize: 10, color: THEME.muted, letterSpacing: 1 },

  meta: { flexDirection: "row", marginTop: 20 },
  metaBlock: { flex: 1, paddingRight: 18 },
  label: {
    fontSize: 8,
    color: THEME.accent,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.4,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  partyName: { fontFamily: "Helvetica-Bold", fontSize: 12, color: THEME.ink },
  partyLine: { color: "#444444" },

  kv: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  kvK: { color: THEME.headHint },
  kvV: { fontFamily: "Helvetica-Bold", color: THEME.ink },

  tHead: { flexDirection: "row", backgroundColor: THEME.ink, marginTop: 22 },
  th: {
    color: "#FFFFFF",
    fontSize: 8,
    letterSpacing: 1.1,
    paddingVertical: 9,
    paddingHorizontal: 12,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  cDesc: { flex: 1, paddingRight: 10 },
  cQty: { width: 46, textAlign: "right" },
  cUnit: { width: 70, textAlign: "right" },
  cAmt: { width: 78, textAlign: "right" },
  itemName: { fontFamily: "Helvetica-Bold", fontSize: 11, color: THEME.ink },
  itemDesc: { color: THEME.muted, fontSize: 9.5, marginTop: 3 },
  amtStrong: { fontFamily: "Helvetica-Bold" },

  totalsWrap: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  totals: { width: 240 },
  tRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tK: { color: THEME.headHint },
  tV: { fontFamily: "Helvetica-Bold", color: THEME.ink },
  grandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 2,
    borderTopColor: THEME.ink,
    marginTop: 4,
    paddingTop: 9,
    paddingHorizontal: 4,
  },
  grandK: { fontFamily: "Helvetica-Bold", fontSize: 14, color: THEME.ink },
  grandV: { fontFamily: "Helvetica-Bold", fontSize: 14, color: THEME.accent },

  callout: {
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: THEME.accent,
    backgroundColor: THEME.accentSoft,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  calloutText: { color: "#444444", fontSize: 10 },

  infoGrid: { flexDirection: "row", marginTop: 16 },
  infoCol: { flex: 1, paddingRight: 24 },
  infoLine: { color: "#444444", marginBottom: 2 },

  footer: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: THEME.line,
    paddingTop: 12,
    textAlign: "center",
  },
  footerText: { color: THEME.faint, fontSize: 9, letterSpacing: 0.4 },
});

export function InvoiceDocument({ data }: { data: InvoiceData }) {
  const sym = data.currencySymbol || "$";
  const sub = subtotalCents(data.items);
  const total = sub - (data.discountCents || 0);
  const footer = [
    data.from.company || "BallyX",
    "Software & Web Solutions",
    data.from.email,
    data.from.phone,
  ]
    .filter(Boolean)
    .join("  \u2022  ");

  return (
    <Document
      title={`Invoice ${data.invoiceNo}`}
      author={data.from.company || "BallyX"}
    >
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={BALLYX_LOGO} style={s.logo} />
          <View style={s.headerRight}>
            <Text style={s.docTitle}>INVOICE</Text>
            <Text style={s.invNo}>{data.invoiceNo}</Text>
          </View>
        </View>

        {/* Meta: From / Bill To / Details */}
        <View style={s.meta}>
          <View style={s.metaBlock}>
            <Text style={s.label}>From</Text>
            <Text style={s.partyName}>{data.from.company}</Text>
            {data.from.name ? <Text style={s.partyLine}>{data.from.name}</Text> : null}
            {data.from.role ? <Text style={s.partyLine}>{data.from.role}</Text> : null}
            {data.from.email ? <Text style={s.partyLine}>{data.from.email}</Text> : null}
            {data.from.phone ? <Text style={s.partyLine}>{data.from.phone}</Text> : null}
          </View>

          <View style={s.metaBlock}>
            <Text style={s.label}>Bill To</Text>
            <Text style={s.partyName}>{data.billTo.name || "—"}</Text>
            {textLines((data.billTo.addressLines || []).join("\n")).map((l, i) => (
              <Text key={i} style={s.partyLine}>{l}</Text>
            ))}
          </View>

          <View style={s.metaBlock}>
            <Text style={s.label}>Details</Text>
            <View style={s.kv}>
              <Text style={s.kvK}>Invoice No.</Text>
              <Text style={s.kvV}>{data.invoiceNo}</Text>
            </View>
            <View style={s.kv}>
              <Text style={s.kvK}>Date Issued</Text>
              <Text style={s.kvV}>{formatDate(data.dateIssued)}</Text>
            </View>
            <View style={s.kv}>
              <Text style={s.kvK}>Due Date</Text>
              <Text style={s.kvV}>{formatDate(data.dueDate)}</Text>
            </View>
            <View style={s.kv}>
              <Text style={s.kvK}>Currency</Text>
              <Text style={s.kvV}>{data.currency}</Text>
            </View>
          </View>
        </View>

        {/* Items table */}
        <View style={s.tHead}>
          <Text style={[s.th, s.cDesc]}>Description</Text>
          <Text style={[s.th, s.cQty]}>Qty</Text>
          <Text style={[s.th, s.cUnit]}>Unit</Text>
          <Text style={[s.th, s.cAmt]}>Amount</Text>
        </View>

        {data.items.map((it, i) => (
          <View key={it.id || i} style={s.row} wrap={false}>
            <View style={s.cDesc}>
              <Text style={s.itemName}>{it.name || "—"}</Text>
              {it.description ? <Text style={s.itemDesc}>{it.description}</Text> : null}
            </View>
            <Text style={s.cQty}>{String(it.quantity)}</Text>
            <Text style={s.cUnit}>{formatMoney(it.unitCents, sym)}</Text>
            <Text style={[s.cAmt, s.amtStrong]}>
              {formatMoney(lineTotalCents(it), sym)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={s.totalsWrap}>
          <View style={s.totals}>
            <View style={s.tRow}>
              <Text style={s.tK}>Subtotal</Text>
              <Text style={s.tV}>{formatMoney(sub, sym)}</Text>
            </View>
            <View style={s.tRow}>
              <Text style={s.tK}>Discount</Text>
              <Text style={s.tV}>{formatMoney(data.discountCents || 0, sym)}</Text>
            </View>
            <View style={s.grandRow}>
              <Text style={s.grandK}>Total Due</Text>
              <Text style={s.grandV}>{formatMoney(total, sym)}</Text>
            </View>
          </View>
        </View>

        {/* Optional recurring callout */}
        {data.recurringNote && data.recurringNote.trim() ? (
          <View style={s.callout}>
            <Text style={s.label}>Ongoing</Text>
            <Text style={s.calloutText}>{data.recurringNote}</Text>
          </View>
        ) : null}

        {/* Payment methods + notes */}
        <View style={s.infoGrid}>
          <View style={s.infoCol}>
            <Text style={s.label}>Payment Methods</Text>
            {textLines(data.paymentMethods).map((l, i) => (
              <Text key={i} style={s.infoLine}>{l}</Text>
            ))}
          </View>
          <View style={s.infoCol}>
            <Text style={s.label}>Notes</Text>
            {textLines(data.notes).map((l, i) => (
              <Text key={i} style={s.infoLine}>{l}</Text>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>{footer}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default InvoiceDocument;
