import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getDomain, getDnsRecords } from "@/lib/dashboard-data";
import { DomainManager } from "@/components/dashboard/domain-manager";

// Reads live Postgres data on every request — must not be statically
// prerendered at build time (see README "Database" section).
export const dynamic = "force-dynamic";

export default async function DashboardDomainDetailPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: domainParam } = await params;
  const domain = decodeURIComponent(domainParam);
  const domainData = await getDomain(domain);

  if (!domainData) {
    notFound();
  }

  const records = await getDnsRecords(domain);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/domains"
        className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-accent-deep"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Domains
      </Link>

      <DomainManager domain={domainData} initialRecords={records} />
    </div>
  );
}
