import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  mockStats,
  mockSites,
  mockActivity,
  mockInvoices,
} from "@/lib/dashboard-mock";

const nextInvoice = mockInvoices.find((invoice) => invoice.status === "Due");

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
          Overview
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Illustrative demo data — nothing here reflects a real account yet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft/70">
              {stat.label}
            </p>
            <p className="mt-2 font-heading text-2xl font-semibold text-ink">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-medium tracking-tight text-ink">
            Recent sites
          </h2>
          <Link
            href="/dashboard/sites"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent-deep hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {mockSites.slice(0, 3).map((site) => (
            <div
              key={site.id}
              className="flex flex-col gap-2 rounded-lg border border-ink/10 bg-paper-soft p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-ink">{site.name}</p>
                <p className="text-xs text-ink-soft">{site.domain}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={site.status === "Live" ? "teal" : "outline"}>
                  {site.status}
                </Badge>
                <span className="text-xs text-ink-soft">
                  Deployed {site.lastDeploy}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-medium tracking-tight text-ink">
              Recent activity
            </h2>
            <Link
              href="/dashboard/activity"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent-deep hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 space-y-4 rounded-lg border border-ink/10 bg-paper-soft p-4">
            {mockActivity.slice(0, 3).map((entry) => (
              <div key={entry.id}>
                <p className="text-xs text-ink-soft">
                  {entry.timestamp} · {entry.actor}
                </p>
                <p className="text-sm font-medium text-ink">
                  {entry.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-medium tracking-tight text-ink">
              Billing
            </h2>
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent-deep hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Card className="mt-4 p-4">
            {nextInvoice ? (
              <>
                <p className="text-xs text-ink-soft">Next invoice due</p>
                <p className="mt-1 text-sm font-medium text-ink">
                  {nextInvoice.description}
                </p>
                <p className="mt-2 font-heading text-xl font-semibold text-ink">
                  {nextInvoice.amount}
                </p>
              </>
            ) : (
              <p className="text-sm text-ink-soft">No invoices due.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
