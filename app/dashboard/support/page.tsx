import { SupportClient } from "@/components/dashboard/support-client";
import { getTickets } from "@/lib/dashboard-data";

// Reads live Postgres data on every request — must not be statically
// prerendered at build time (see README "Database" section).
export const dynamic = "force-dynamic";

export default async function DashboardSupportPage() {
  const tickets = await getTickets();
  return <SupportClient initialTickets={tickets} />;
}
