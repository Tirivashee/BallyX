import type { Metadata } from "next";

import { AppForm } from "@/components/dashboard/apps/app-form";
import { createApp } from "@/lib/actions/apps-admin";

export const metadata: Metadata = {
  title: "New app",
  robots: { index: false, follow: false },
};

export default function NewAppPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">New app</h1>
      <div className="mt-8">
        <AppForm action={createApp} submitLabel="Create app" />
      </div>
    </div>
  );
}
