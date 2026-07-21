"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardSettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
          Settings
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Preview only — nothing on this page is saved to a real backend
          yet.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        onChange={() => setSaved(false)}
        className="max-w-lg space-y-5 rounded-lg border border-ink/10 bg-paper-soft p-6"
      >
        <div className="space-y-2">
          <Label htmlFor="site-name">Site name</Label>
          <Input id="site-name" defaultValue="Example Storefront" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-domain">Custom domain</Label>
          <Input id="custom-domain" defaultValue="shop.example.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deploy-branch">Deployment branch</Label>
          <Input id="deploy-branch" defaultValue="main" />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="force-https"
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-ink/25 accent-accent"
          />
          <Label htmlFor="force-https" className="font-normal">
            Force HTTPS
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="auto-deploy"
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-ink/25 accent-accent"
          />
          <Label htmlFor="auto-deploy" className="font-normal">
            Auto-deploy on push
          </Label>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit">Save changes</Button>
          {saved && (
            <span className="text-sm text-teal">
              Saved (demo only — not persisted)
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
