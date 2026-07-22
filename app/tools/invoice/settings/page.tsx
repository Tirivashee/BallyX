import type { Metadata } from "next";
import Link from "next/link";

import { getSettings, getSavedItems } from "@/lib/invoice/invoice-data";
import { InvoiceSettingsForm } from "./InvoiceSettingsForm";
import styles from "../invoice-tool.module.css";

export const metadata: Metadata = {
  title: "Invoice Settings",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function InvoiceSettingsPage() {
  const [settings, savedItems] = await Promise.all([getSettings(), getSavedItems()]);

  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <div className={styles.brand}>Invoice Settings</div>
          <div className={styles.brandSub}>
            Business details, payment methods, and a saved-items price list.
          </div>
        </div>
        <div className={styles.actions} style={{ marginTop: 0 }}>
          <Link href="/tools/invoice" className={styles.ghost}>
            ← Back to invoice
          </Link>
        </div>
      </div>

      <InvoiceSettingsForm settings={settings} savedItems={savedItems} />
    </div>
  );
}
