"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState } from "@/lib/actions/apps-admin";
import type { AdminApp } from "@/lib/apps-admin-data";
import { cn } from "@/lib/utils";

type Screenshot = { src: string; alt: string; caption: string };

const initialState: ActionState = { status: "idle" };

export function AppForm({
  app,
  action,
  submitLabel,
}: {
  app?: AdminApp;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [deliveryType, setDeliveryType] = useState<"desktop" | "cloud">(
    app?.deliveryType ?? "desktop",
  );
  const [downloadReady, setDownloadReady] = useState(app?.downloadReady ?? false);
  const [published, setPublished] = useState(app?.published ?? false);
  const [screenshots, setScreenshots] = useState<Screenshot[]>(app?.screenshots ?? []);

  const addScreenshot = () => setScreenshots((s) => [...s, { src: "", alt: "", caption: "" }]);
  const updateScreenshot = (i: number, patch: Partial<Screenshot>) =>
    setScreenshots((s) => s.map((sc, idx) => (idx === i ? { ...sc, ...patch } : sc)));
  const removeScreenshot = (i: number) => setScreenshots((s) => s.filter((_, idx) => idx !== i));

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="deliveryType" value={deliveryType} />
      <input type="hidden" name="downloadReady" value={downloadReady ? "true" : "false"} />
      <input type="hidden" name="published" value={published ? "true" : "false"} />
      <input type="hidden" name="screenshotsJson" value={JSON.stringify(screenshots)} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={app?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={app?.slug} placeholder="my-app" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" defaultValue={app?.tagline} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={app?.description} rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="iconUrl">Icon URL</Label>
        <Input
          id="iconUrl"
          name="iconUrl"
          defaultValue={app?.iconUrl ?? ""}
          placeholder="https://…"
        />
        <p className="text-xs text-ink-soft">
          Leave blank to use a placeholder icon. A real upload widget lands once Vercel Blob is
          provisioned.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input id="version" name="version" defaultValue={app?.version} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="releaseDate">Release date</Label>
          <Input
            id="releaseDate"
            name="releaseDate"
            defaultValue={app?.releaseDate}
            placeholder="e.g. 21 October 2026"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="platforms">Platforms (comma-separated)</Label>
        <Input
          id="platforms"
          name="platforms"
          defaultValue={app?.platforms.join(", ")}
          placeholder="Windows 10/11, macOS"
        />
      </div>

      <div className="space-y-2">
        <Label>Delivery type</Label>
        <div className="flex gap-2">
          {(["desktop", "cloud"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setDeliveryType(type)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                deliveryType === type
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/20 text-ink-soft hover:bg-ink/5",
              )}
            >
              {type === "desktop" ? "Desktop (installer)" : "Cloud (browser)"}
            </button>
          ))}
        </div>
      </div>

      {deliveryType === "desktop" ? (
        <div className="space-y-2">
          <Label htmlFor="fileSize">File size</Label>
          <Input
            id="fileSize"
            name="fileSize"
            defaultValue={app?.fileSize ?? ""}
            placeholder="e.g. 3.4 MB"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="access">Access</Label>
          <Input
            id="access"
            name="access"
            defaultValue={app?.access ?? ""}
            placeholder="e.g. Web browser — no install"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="downloadUrl">Download / sign-up URL</Label>
        <Input
          id="downloadUrl"
          name="downloadUrl"
          defaultValue={app?.downloadUrl ?? ""}
          placeholder="https://…"
        />
      </div>

      <div className="flex items-center justify-between gap-4 rounded-md border border-ink/10 bg-paper-soft p-4">
        <p className="text-sm font-medium text-ink">Download ready</p>
        <Switch
          checked={downloadReady}
          onCheckedChange={setDownloadReady}
          aria-label="Download ready"
        />
      </div>

      <div className="flex items-center justify-between gap-4 rounded-md border border-ink/10 bg-paper-soft p-4">
        <div>
          <p className="text-sm font-medium text-ink">Published</p>
          <p className="text-xs text-ink-soft">Visible on the public /downloads page.</p>
        </div>
        <Switch checked={published} onCheckedChange={setPublished} aria-label="Published" />
      </div>

      <div className="space-y-3">
        <Label>Screenshots</Label>
        {screenshots.map((s, i) => (
          <div
            key={i}
            className="grid grid-cols-1 gap-2 rounded-md border border-ink/10 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <Input
              placeholder="Image URL"
              value={s.src}
              onChange={(e) => updateScreenshot(i, { src: e.target.value })}
            />
            <Input
              placeholder="Alt text"
              value={s.alt}
              onChange={(e) => updateScreenshot(i, { alt: e.target.value })}
            />
            <Input
              placeholder="Caption"
              value={s.caption}
              onChange={(e) => updateScreenshot(i, { caption: e.target.value })}
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeScreenshot(i)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addScreenshot}>
          + Add screenshot
        </Button>
      </div>

      {state.status === "error" && state.message && (
        <p className="text-sm text-accent-deep" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
