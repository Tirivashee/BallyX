"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Backup } from "@/lib/dashboard-data";

export function BackupsClient({ initialBackups }: { initialBackups: Backup[] }) {
  const [backups, setBackups] = useState<Backup[]>(initialBackups);
  const [message, setMessage] = useState<string | null>(null);

  function handleCreateBackup() {
    const backup: Backup = {
      id: `demo-${Date.now()}`,
      site: "Example Storefront",
      createdAt: "Just now",
      size: "414 MB",
      type: "Manual",
    };
    setBackups((prev) => [backup, ...prev]);
    setMessage("Backup created (demo only) — nothing was actually backed up.");
  }

  function handleRestore(site: string) {
    setMessage(
      `Restore of "${site}" started (demo only) — nothing was actually changed.`,
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
            Backups
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Illustrative demo data — creating or restoring a backup here
            doesn&apos;t touch real infrastructure.
          </p>
        </div>
        <Button onClick={handleCreateBackup}>Create backup now</Button>
      </div>

      {message && <p className="text-sm text-teal">{message}</p>}

      <div className="space-y-3">
        {backups.map((backup) => (
          <div
            key={backup.id}
            className="flex flex-col gap-3 rounded-lg border border-ink/10 bg-paper-soft p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium text-ink">{backup.site}</p>
              <p className="text-xs text-ink-soft">
                {backup.createdAt} · {backup.size}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={backup.type === "Automatic" ? "teal" : "outline"}>
                {backup.type}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRestore(backup.site)}
              >
                Restore
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
