"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Shared by the apps/blog admin forms for icon, screenshot, and cover
// image fields. The URL input stays editable alongside the upload
// button — a deliberate fallback for pasting an already-hosted image,
// and the only option before Vercel Blob was provisioned.
export function ImageUploadField({
  id,
  label,
  value,
  onChange,
  folder = "uploads",
  helpText,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  helpText?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const blob = await upload(`${folder}/${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      });
      onChange(blob.url);
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Upload failed. Try again, or paste a URL instead.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {error ? (
        <p className="text-xs text-accent-deep">{error}</p>
      ) : (
        helpText && <p className="text-xs text-ink-soft">{helpText}</p>
      )}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element -- admin-only preview thumbnail for an arbitrary/just-uploaded URL, not worth next/image's optimizer config for this.
        <img
          src={value}
          alt=""
          className="h-20 w-20 rounded-md border border-ink/10 object-cover"
        />
      )}
    </div>
  );
}
