"use client";

import React, { useEffect, useState } from "react";
import type { InvoiceData } from "@/lib/invoice/types";
import { makeDefaultInvoice } from "@/lib/invoice/defaults";
import { peekInvoiceNo, advanceInvoiceSequence } from "@/lib/invoice/sequence";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import styles from "./invoice-tool.module.css";

export default function InvoiceToolPage() {
  const [data, setData] = useState<InvoiceData>(() => makeDefaultInvoice());
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
    setData({ ...makeDefaultInvoice(), invoiceNo: peekInvoiceNo() });
    setError(null);
  }

  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <div className={styles.brand}>
            Bally<span className={styles.x}>X</span>
          </div>
          <div className={styles.brandSub}>Invoice Generator</div>
        </div>
        <div className={styles.actions} style={{ marginTop: 0 }}>
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
          {error && <span className={styles.error}>{error}</span>}
        </div>
      </div>

      <div className={styles.layout}>
        <InvoiceForm data={data} onChange={setData} />
        <div className={styles.previewPanel}>
          <p className={styles.previewLabel}>Live preview</p>
          <InvoicePreview data={data} />
        </div>
      </div>
    </div>
  );
}
