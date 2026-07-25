import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteApp } from "@/lib/actions/apps-admin";
import { getAdminApps } from "@/lib/apps-admin-data";

export const metadata: Metadata = {
  title: "Apps",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardAppsPage() {
  const apps = await getAdminApps();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">Apps</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage the app catalog shown on /downloads. Pluto, Mars, and Venus stay hardcoded —
            these are additional listings.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/apps/new">New app</Link>
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {apps.length === 0 && (
          <p className="text-sm text-ink-soft">No apps added yet.</p>
        )}

        {apps.map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between gap-4 rounded-md border border-ink/10 bg-paper-soft p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-ink">{app.name}</p>
                <Badge variant={app.published ? "teal" : "outline"}>
                  {app.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="text-xs text-ink-soft">/downloads/{app.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/apps/${app.id}`}>Edit</Link>
              </Button>
              <form action={deleteApp.bind(null, app.id)}>
                <Button type="submit" variant="ghost" size="sm">
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
