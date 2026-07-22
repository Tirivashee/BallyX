"use client";

import React from "react";
import type { InvoiceData, LineItem, Party } from "@/lib/invoice/types";
import { newItemId } from "@/lib/invoice/defaults";
import { toCents, toDollars } from "@/lib/invoice/format";
import styles from "./invoice-tool.module.css";

interface Props {
  data: InvoiceData;
  onChange: (next: InvoiceData) => void;
}

export function InvoiceForm({ data, onChange }: Props) {
  const set = (patch: Partial<InvoiceData>) => onChange({ ...data, ...patch });
  const setFrom = (patch: Partial<Party>) => set({ from: { ...data.from, ...patch } });
  const setBillTo = (patch: Partial<Party>) => set({ billTo: { ...data.billTo, ...patch } });

  const setItem = (id: string, patch: Partial<LineItem>) =>
    set({ items: data.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) });

  const addItem = () =>
    set({
      items: [
        ...data.items,
        { id: newItemId(), name: "", description: "", quantity: 1, unitCents: 0 },
      ],
    });

  const removeItem = (id: string) =>
    set({ items: data.items.filter((it) => it.id !== id) });

  const billToText = (data.billTo.addressLines || []).join("\n");

  return (
    <div className={styles.panel}>
      {/* Details */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Invoice Details</h2>
        <div className={styles.field}>
          <label className={styles.label}>Invoice Number</label>
          <input
            className={styles.input}
            value={data.invoiceNo}
            onChange={(e) => set({ invoiceNo: e.target.value })}
          />
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Date Issued</label>
            <input
              type="date"
              className={styles.input}
              value={data.dateIssued}
              onChange={(e) => set({ dateIssued: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Due Date</label>
            <input
              type="date"
              className={styles.input}
              value={data.dueDate}
              onChange={(e) => set({ dueDate: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Currency Code</label>
            <input
              className={styles.input}
              value={data.currency}
              onChange={(e) => set({ currency: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Currency Symbol</label>
            <input
              className={styles.input}
              value={data.currencySymbol}
              onChange={(e) => set({ currencySymbol: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* From */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>From</h2>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Company</label>
            <input
              className={styles.input}
              value={data.from.company || ""}
              onChange={(e) => setFrom({ company: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              value={data.from.name || ""}
              onChange={(e) => setFrom({ name: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Role</label>
          <input
            className={styles.input}
            value={data.from.role || ""}
            onChange={(e) => setFrom({ role: e.target.value })}
          />
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              value={data.from.email || ""}
              onChange={(e) => setFrom({ email: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Phone</label>
            <input
              className={styles.input}
              value={data.from.phone || ""}
              onChange={(e) => setFrom({ phone: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Bill To</h2>
        <div className={styles.field}>
          <label className={styles.label}>Client Name</label>
          <input
            className={styles.input}
            value={data.billTo.name || ""}
            placeholder="Dr. Mbaimbai"
            onChange={(e) => setBillTo({ name: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Address / Details (one per line)</label>
          <textarea
            className={styles.textarea}
            value={billToText}
            placeholder={"Veterinary Clinic & Shop\nHarare, Zimbabwe"}
            onChange={(e) =>
              setBillTo({ addressLines: e.target.value.split("\n") })
            }
          />
        </div>
      </div>

      {/* Line items */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Line Items</h2>
        {data.items.map((it, i) => (
          <div key={it.id} className={styles.item}>
            <div className={styles.itemHead}>
              <span className={styles.itemIndex}>Item {i + 1}</span>
              {data.items.length > 1 && (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => removeItem(it.id)}
                >
                  Remove
                </button>
              )}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <input
                className={styles.input}
                value={it.name}
                placeholder="Website Design & Development"
                onChange={(e) => setItem(it.id, { name: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={it.description || ""}
                onChange={(e) => setItem(it.id, { description: e.target.value })}
              />
            </div>
            <div className={styles.itemRow}>
              <div className={styles.field}>
                <label className={styles.label}>Qty</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className={styles.input}
                  value={it.quantity}
                  onChange={(e) =>
                    setItem(it.id, { quantity: Math.max(0, Math.round(Number(e.target.value) || 0)) })
                  }
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Unit ({data.currencySymbol})</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className={styles.input}
                  value={toDollars(it.unitCents)}
                  onChange={(e) => setItem(it.id, { unitCents: toCents(e.target.value) })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Line Total</label>
                <input
                  className={styles.input}
                  value={`${data.currencySymbol}${(
                    (it.quantity * it.unitCents) / 100
                  ).toFixed(2)}`}
                  readOnly
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>
        ))}
        <button type="button" className={styles.addBtn} onClick={addItem}>
          + Add line item
        </button>
      </div>

      {/* Adjustments + notes */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Adjustments & Notes</h2>
        <div className={styles.field}>
          <label className={styles.label}>Discount ({data.currencySymbol})</label>
          <input
            type="number"
            min={0}
            step={0.01}
            className={styles.input}
            value={toDollars(data.discountCents)}
            onChange={(e) => set({ discountCents: toCents(e.target.value) })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Ongoing / Recurring Callout (optional)</label>
          <textarea
            className={styles.textarea}
            value={data.recurringNote || ""}
            placeholder="Web hosting is billed at $2.00 / month from Month 2 onward…"
            onChange={(e) => set({ recurringNote: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Payment Methods (one per line)</label>
          <textarea
            className={styles.textarea}
            value={data.paymentMethods || ""}
            onChange={(e) => set({ paymentMethods: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Notes (one per line)</label>
          <textarea
            className={styles.textarea}
            value={data.notes || ""}
            onChange={(e) => set({ notes: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

export default InvoiceForm;
