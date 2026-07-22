"use client";

import { useState, type FormEvent } from "react";
import { Lock, LockOpen, Server, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BrandName } from "@/components/ui/brand-name";
import { cn } from "@/lib/utils";
import type { DnsRecord, Domain } from "@/lib/dashboard-data";

const recordTypes: DnsRecord["type"][] = ["A", "CNAME", "MX", "TXT", "NS"];

const selectClassName =
  "flex h-11 w-full rounded-md border border-ink/20 bg-paper-soft px-3 py-2 text-sm text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent";

export function DomainManager({
  domain,
  initialRecords,
}: {
  domain: Domain;
  initialRecords: DnsRecord[];
}) {
  const [autoRenew, setAutoRenew] = useState(domain.autoRenew);
  const [privacyProtection, setPrivacyProtection] = useState(
    domain.privacyProtection,
  );
  const [locked, setLocked] = useState(domain.locked);
  const [records, setRecords] = useState<DnsRecord[]>(initialRecords);

  const [newType, setNewType] = useState<DnsRecord["type"]>("A");
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newTtl, setNewTtl] = useState("3600");

  function handleAddRecord(e: FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newValue.trim()) return;

    setRecords((prev) => [
      ...prev,
      {
        id: `demo-${Date.now()}`,
        type: newType,
        name: newName.trim(),
        value: newValue.trim(),
        ttl: newTtl.trim() || "3600",
      },
    ]);
    setNewName("");
    setNewValue("");
    setNewTtl("3600");
  }

  function handleDeleteRecord(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
          {domain.domain}
        </h1>
        <Badge
          variant={
            domain.status === "Active"
              ? "teal"
              : domain.status === "Pending"
                ? "accent"
                : "outline"
          }
        >
          {domain.status}
        </Badge>
        <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
          {locked ? (
            <Lock className="h-3.5 w-3.5" />
          ) : (
            <LockOpen className="h-3.5 w-3.5" />
          )}
          {locked ? "Transfer locked" : "Transfer unlocked"}
        </span>
      </div>
      <p className="-mt-4 text-sm text-ink-soft">
        Preview only — every control on this page updates local state, not
        a real registrar.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-heading text-lg font-medium tracking-tight text-ink">
            Registration
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Registrar</dt>
              <dd className="font-medium text-ink">{domain.registrar}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Registered on</dt>
              <dd className="font-medium text-ink">{domain.registeredOn}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Expires on</dt>
              <dd className="font-medium text-ink">{domain.expiresOn}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">SSL certificate</dt>
              <dd className="font-medium text-ink">{domain.ssl}</dd>
            </div>
          </dl>
          <Button variant="outline" size="sm" className="mt-5">
            Renew now
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="font-heading text-lg font-medium tracking-tight text-ink">
            Renewal &amp; protection
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">Auto-renew</p>
                <p className="text-xs text-ink-soft">
                  Renew automatically before expiry.
                </p>
              </div>
              <Switch
                checked={autoRenew}
                onCheckedChange={setAutoRenew}
                aria-label="Auto-renew this domain"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">
                  WHOIS privacy
                </p>
                <p className="text-xs text-ink-soft">
                  Hide contact details from the public WHOIS record.
                </p>
              </div>
              <Switch
                checked={privacyProtection}
                onCheckedChange={setPrivacyProtection}
                aria-label="WHOIS privacy protection"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">
                  Transfer lock
                </p>
                <p className="text-xs text-ink-soft">
                  Block transfers to another registrar.
                </p>
              </div>
              <Switch
                checked={locked}
                onCheckedChange={setLocked}
                aria-label="Transfer lock"
              />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="flex items-center gap-2 font-heading text-lg font-medium tracking-tight text-ink">
          <Server className="h-4 w-4 text-ink-soft" />
          Nameservers
        </h2>
        <ul className="mt-4 space-y-2">
          {domain.nameservers.map((ns) => (
            <li
              key={ns}
              className="rounded-md border border-ink/10 bg-paper px-3 py-2 font-mono text-sm text-ink"
            >
              {ns}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-soft">
          <BrandName text="Using BallyX Hosting nameservers. Custom nameservers aren't supported in this preview yet." />
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-lg font-medium tracking-tight text-ink">
          DNS records
        </h2>

        <div className="mt-4 overflow-x-auto rounded-md border border-ink/10">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-paper text-xs uppercase tracking-wider text-ink-soft/70">
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Value</th>
                <th className="px-3 py-2 font-medium">TTL</th>
                <th className="px-3 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-ink/10 last:border-b-0">
                  <td className="px-3 py-2">
                    <span className="rounded-sm bg-ink/5 px-2 py-0.5 font-mono text-xs text-ink">
                      {record.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-ink">{record.name}</td>
                  <td className="max-w-[240px] truncate px-3 py-2 font-mono text-ink-soft" title={record.value}>
                    {record.value}
                  </td>
                  <td className="px-3 py-2 text-ink-soft">{record.ttl}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(record.id)}
                      aria-label={`Delete ${record.type} record for ${record.name}`}
                      className="text-ink-soft transition-colors hover:text-accent-deep"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-ink-soft">
                    No DNS records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <form
          onSubmit={handleAddRecord}
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[100px_1fr_1fr_90px_auto] sm:items-end"
        >
          <div className="space-y-2">
            <Label htmlFor="record-type">Type</Label>
            <select
              id="record-type"
              value={newType}
              onChange={(e) => setNewType(e.target.value as DnsRecord["type"])}
              className={cn(selectClassName)}
            >
              {recordTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="record-name">Name</Label>
            <Input
              id="record-name"
              placeholder="@ or subdomain"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="record-value">Value</Label>
            <Input
              id="record-value"
              placeholder="e.g. 76.76.21.21"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="record-ttl">TTL</Label>
            <Input
              id="record-ttl"
              value={newTtl}
              onChange={(e) => setNewTtl(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Add record
          </Button>
        </form>
      </Card>
    </div>
  );
}
