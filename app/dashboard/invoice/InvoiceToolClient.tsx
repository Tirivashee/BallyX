"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { InvoiceData } from "@/lib/invoice/types";
import { makeDefaultInvoice } from "@/lib/invoice/defaults";
import { peekInvoiceNo, advanceInvoiceSequence } from "@/lib/invoice/sequence";
import type { Customer, InvoiceSettings, SavedItem } from "@/lib/invoice/invoice-data";
import { logout } from "@/lib/actions/auth";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import styles from "./invoice-tool.module.css";

interface Props {
  customers: Customer[];
  settings: InvoiceSettings | null;
  savedItems: SavedItem[];
}

export default function InvoiceToolClient({ customers, settings, savedItems }: Props) {
  const [data, setData] = useState<InvoiceData>(() => makeDefaultInvoice(settings));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Swap in the real next invoice number once mounted (localStorage isn't
  // available during SSR, so the initial render uses the static default).
  useEffect(() => {
    setData((d) => ({ ...d, invoiceNo: peekInvoiceNo() }));
  }, []);

  async function handleDownload() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        let msg = "Could not generate the PDF.";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(data.invoiceNo || "invoice").replace(/[^a-z0-9._-]+/gi, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      advanceInvoiceSequence();
      setData((d) => ({ ...d, invoiceNo: peekInvoiceNo() }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function handleReset() {
    setData({ ...makeDefaultInvoice(settings), invoiceNo: peekInvoiceNo() });
    setError(null);
  }

  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <div className={styles.brand}>Invoice Generator</div>
          <div className={styles.brandSub}>Fill in the details, then download a PDF.</div>
        </div>
        <div className={styles.actions} style={{ marginTop: 0 }}>
          <Link href="/tools/invoice/settings" className={styles.ghost}>
            Settings
          </Link>
          <button type="button" className={styles.ghost} onClick={handleReset}>
            Reset
          </button>
          <button
            type="button"
            className={styles.primary}
            onClick={handleDownload}
            disabled={busy}
          >
            {busy ? (
              <>
                <span className={styles.spinner} /> Generating…
              </>
            ) : (
              <>
                Download PDF <span className={styles.dot}>↓</span>
              </>
            )}
          </button>
          <form action={logout}>
            <button type="submit" className={styles.ghost}>
              Sign out
            </button>
          </form>
          {error && <span className={styles.error}>{error}</span>}
        </div>
      </div>

      <div className={styles.layout}>
        <InvoiceForm data={data} onChange={setData} customers={customers} savedItems={savedItems} />
        <div className={styles.previewPanel}>
          <p className={styles.previewLabel}>Live preview</p>
          <InvoicePreview data={data} />
        </div>
      </div>
    </div>
  );
}
