import { BackupsClient } from "@/components/dashboard/backups-client";
import { getBackups } from "@/lib/dashboard-data";

// Reads live Postgres data on every request — must not be statically
// prerendered at build time (see README "Database" section).
export const dynamic = "force-dynamic";

export default async function DashboardBackupsPage() {
  const backups = await getBackups();
  return <BackupsClient initialBackups={backups} />;
}
