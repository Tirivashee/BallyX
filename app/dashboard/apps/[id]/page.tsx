import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppForm } from "@/components/dashboard/apps/app-form";
import { updateApp } from "@/lib/actions/apps-admin";
import { getAdminAppById } from "@/lib/apps-admin-data";

export const metadata: Metadata = {
  title: "Edit app",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditAppPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await getAdminAppById(Number(id));
  if (!app) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
        Edit {app.name}
      </h1>
      <div className="mt-8">
        <AppForm app={app} action={updateApp.bind(null, app.id)} submitLabel="Save changes" />
      </div>
    </div>
  );
}
