import { DomainsClient } from "@/components/dashboard/domains-client";
import { getDomains } from "@/lib/dashboard-data";

// Reads live Postgres data on every request — must not be statically
// prerendered at build time (see README "Database" section).
export const dynamic = "force-dynamic";

export default async function DashboardDomainsPage() {
  const domains = await getDomains();
  return <DomainsClient initialDomains={domains} />;
}
