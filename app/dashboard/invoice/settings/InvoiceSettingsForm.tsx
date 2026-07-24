"use client";

import React, { useActionState } from "react";
import type { InvoiceSettings, SavedItem } from "@/lib/invoice/invoice-data";
import {
  updateInvoiceSettings,
  addSavedItem,
  deleteSavedItem,
  type ActionState,
} from "@/lib/actions/invoice-admin";
import styles from "../invoice-tool.module.css";

const initialState: ActionState = { status: "idle" };

interface Props {
  settings: InvoiceSettings | null;
  savedItems: SavedItem[];
}

export function InvoiceSettingsForm({ settings, savedItems }: Props) {
  const [settingsState, settingsAction, settingsPending] = useActionState(
    updateInvoiceSettings,
    initialState
  );
  const [itemState, itemAction, itemPending] = useActionState(addSavedItem, initialState);

  return (
    <div className={styles.layout}>
      <div className={styles.panel}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Business Details</h2>
          <form action={settingsAction}>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>Company</label>
                <input
                  className={styles.input}
                  name="fromCompany"
                  defaultValue={settings?.fromCompany ?? ""}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input
                  className={styles.input}
                  name="fromName"
                  defaultValue={settings?.fromName ?? ""}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Role</label>
              <input
                className={styles.input}
                name="fromRole"
                defaultValue={settings?.fromRole ?? ""}
              />
            </div>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  name="fromEmail"
                  defaultValue={settings?.fromEmail ?? ""}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone</label>
                <input
                  className={styles.input}
                  name="fromPhone"
                  defaultValue={settings?.fromPhone ?? ""}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Payment Methods (one per line)</label>
              <textarea
                className={styles.textarea}
                name="paymentMethods"
                defaultValue={settings?.paymentMethods ?? ""}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Default Notes (one per line)</label>
              <textarea
                className={styles.textarea}
                name="notes"
                defaultValue={settings?.notes ?? ""}
              />
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.primary} disabled={settingsPending}>
                {settingsPending ? "Saving…" : "Save settings"}
              </button>
              {settingsState.status === "success" && (
                <span style={{ color: "#1a7f37", fontSize: 12, fontWeight: 600 }}>
                  {settingsState.message}
                </span>
              )}
              {settingsState.status === "error" && (
                <span className={styles.error}>{settingsState.message}</span>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Saved Line Items</h2>

          {savedItems.length === 0 && (
            <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
              No saved items yet — add ones you bill often below.
            </p>
          )}

          {savedItems.map((it) => (
            <div key={it.id} className={styles.item}>
              <div className={styles.itemHead}>
                <span className={styles.itemIndex}>
                  {it.name} — {(it.unitCents / 100).toFixed(2)}
                </span>
                <form action={deleteSavedItem.bind(null, it.id)}>
                  <button type="submit" className={styles.remove}>
                    Remove
                  </button>
                </form>
              </div>
              {it.description && (
                <p style={{ fontSize: 12, color: "#666", margin: 0 }}>{it.description}</p>
              )}
            </div>
          ))}

          <form action={itemAction} className={styles.item}>
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <input className={styles.input} name="name" placeholder="Web hosting" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description (optional)</label>
              <textarea className={styles.textarea} name="description" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Unit price</label>
              <input
                className={styles.input}
                name="unit"
                type="number"
                min={0}
                step={0.01}
                placeholder="2.00"
                required
              />
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.addBtn} disabled={itemPending}>
                {itemPending ? "Saving…" : "+ Add saved item"}
              </button>
            </div>
            {itemState.status === "error" && (
              <span className={styles.error}>{itemState.message}</span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default InvoiceSettingsForm;
