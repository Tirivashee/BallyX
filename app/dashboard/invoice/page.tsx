import type { Metadata } from "next";

import { getCustomers, getSettings, getSavedItems } from "@/lib/invoice/invoice-data";
import InvoiceToolClient from "./InvoiceToolClient";

export const metadata: Metadata = {
  title: "Invoice Generator",
  description: "Generate a BallyX invoice PDF.",
  robots: { index: false, follow: false },
};

// Reads fresh customers/settings/saved items from Postgres on every visit.
export const dynamic = "force-dynamic";

export default async function InvoiceToolPage() {
  const [customers, settings, savedItems] = await Promise.all([
    getCustomers(),
    getSettings(),
    getSavedItems(),
  ]);

  return (
    <InvoiceToolClient customers={customers} settings={settings} savedItems={savedItems} />
  );
}
