"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, LockOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { BrandName } from "@/components/ui/brand-name";
import type { Domain } from "@/lib/dashboard-data";

export function DomainsClient({ initialDomains }: { initialDomains: Domain[] }) {
  const [domains, setDomains] = useState<Domain[]>(initialDomains);

  function toggleAutoRenew(domain: string) {
    setDomains((prev) =>
      prev.map((d) =>
        d.domain === domain ? { ...d, autoRenew: !d.autoRenew } : d,
      ),
    );
  }

  function togglePrivacy(domain: string) {
    setDomains((prev) =>
      prev.map((d) =>
        d.domain === domain
          ? { ...d, privacyProtection: !d.privacyProtection }
          : d,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
          Domains &amp; SSL
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Illustrative demo data — toggles here update this preview only
          and reset on refresh, they don&apos;t call a real registrar.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-ink/10 bg-paper-soft">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink-soft/70">
              <th className="px-4 py-3 font-medium">Domain</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Expires</th>
              <th className="px-4 py-3 font-medium">Auto-renew</th>
              <th className="px-4 py-3 font-medium">Privacy</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {domains.map((d) => (
              <tr key={d.domain} className="border-b border-ink/10 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 font-medium text-ink">
                    {d.locked ? (
                      <Lock className="h-3.5 w-3.5 shrink-0 text-ink-soft" />
                    ) : (
                      <LockOpen className="h-3.5 w-3.5 shrink-0 text-ink-soft" />
                    )}
                    {d.domain}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-soft">
                    <BrandName text={d.registrar} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      d.status === "Active"
                        ? "teal"
                        : d.status === "Pending"
                          ? "accent"
                          : "outline"
                    }
                  >
                    {d.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-ink-soft">{d.expiresOn}</td>
                <td className="px-4 py-3">
                  <Switch
                    checked={d.autoRenew}
                    onCheckedChange={() => toggleAutoRenew(d.domain)}
                    aria-label={`Auto-renew ${d.domain}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <Switch
                    checked={d.privacyProtection}
                    onCheckedChange={() => togglePrivacy(d.domain)}
                    aria-label={`WHOIS privacy for ${d.domain}`}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/domains/${encodeURIComponent(d.domain)}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent-deep hover:underline"
                  >
                    Manage
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
