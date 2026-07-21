import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { mockDomains, mockDnsRecords } from "@/lib/dashboard-mock";
import { DomainManager } from "@/components/dashboard/domain-manager";

export default async function DashboardDomainDetailPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: domainParam } = await params;
  const domain = decodeURIComponent(domainParam);
  const domainData = mockDomains.find((d) => d.domain === domain);

  if (!domainData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/domains"
        className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-accent-deep"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Domains
      </Link>

      <DomainManager
        domain={domainData}
        initialRecords={mockDnsRecords[domain] ?? []}
      />
    </div>
  );
}
