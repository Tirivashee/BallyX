"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { query } from "@/lib/db";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const ScreenshotSchema = z.object({
  src: z.string().trim().min(1),
  alt: z.string().trim().max(300).optional().or(z.literal("")),
  caption: z.string().trim().max(200).optional().or(z.literal("")),
});

const AppSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  name: z.string().trim().min(1, "Name is required.").max(200),
  iconUrl: z.string().trim().max(2000).optional().or(z.literal("")),
  tagline: z.string().trim().max(300).optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  version: z.string().trim().max(50).optional().or(z.literal("")),
  releaseDate: z.string().trim().max(50).optional().or(z.literal("")),
  platforms: z.string().trim().max(500).optional().or(z.literal("")),
  deliveryType: z.enum(["desktop", "cloud"]),
  fileSize: z.string().trim().max(50).optional().or(z.literal("")),
  access: z.string().trim().max(200).optional().or(z.literal("")),
  downloadReady: z.enum(["true", "false"]),
  downloadUrl: z.string().trim().max(2000).optional().or(z.literal("")),
  screenshotsJson: z.string(),
  published: z.enum(["true", "false"]),
});

function parseScreenshots(json: string): { src: string; alt: string; caption: string }[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const out: { src: string; alt: string; caption: string }[] = [];
  for (const entry of parsed) {
    const result = ScreenshotSchema.safeParse(entry);
    if (result.success) {
      out.push({
        src: result.data.src,
        alt: result.data.alt || "",
        caption: result.data.caption || "",
      });
    }
  }
  return out;
}

function parseForm(formData: FormData) {
  return AppSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    iconUrl: formData.get("iconUrl"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    version: formData.get("version"),
    releaseDate: formData.get("releaseDate"),
    platforms: formData.get("platforms"),
    deliveryType: formData.get("deliveryType"),
    fileSize: formData.get("fileSize"),
    access: formData.get("access"),
    downloadReady: formData.get("downloadReady"),
    downloadUrl: formData.get("downloadUrl"),
    screenshotsJson: formData.get("screenshotsJson"),
    published: formData.get("published"),
  });
}

export async function createApp(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the highlighted fields.",
    };
  }
  const d = parsed.data;
  const platforms = d.platforms
    ? d.platforms.split(",").map((p) => p.trim()).filter(Boolean)
    : [];
  const screenshots = parseScreenshots(d.screenshotsJson);

  try {
    await query(
      `INSERT INTO apps
         (slug, name, icon_url, tagline, description, version, release_date, platforms,
          delivery_type, file_size, access, download_ready, download_url, screenshots, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        d.slug,
        d.name,
        d.iconUrl || null,
        d.tagline || "",
        d.description || "",
        d.version || "",
        d.releaseDate || "",
        platforms,
        d.deliveryType,
        d.fileSize || null,
        d.access || null,
        d.downloadReady === "true",
        d.downloadUrl || null,
        JSON.stringify(screenshots),
        d.published === "true",
      ],
    );
  } catch (err) {
    console.error("Failed to create app:", err);
    return { status: "error", message: "Could not save — is the slug already used?" };
  }

  revalidatePath("/dashboard/apps");
  revalidatePath("/downloads");
  redirect("/dashboard/apps");
}

export async function updateApp(
  id: number,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the highlighted fields.",
    };
  }
  const d = parsed.data;
  const platforms = d.platforms
    ? d.platforms.split(",").map((p) => p.trim()).filter(Boolean)
    : [];
  const screenshots = parseScreenshots(d.screenshotsJson);

  try {
    await query(
      `UPDATE apps SET
         slug = $1, name = $2, icon_url = $3, tagline = $4, description = $5, version = $6,
         release_date = $7, platforms = $8, delivery_type = $9, file_size = $10, access = $11,
         download_ready = $12, download_url = $13, screenshots = $14, published = $15, updated_at = now()
       WHERE id = $16`,
      [
        d.slug,
        d.name,
        d.iconUrl || null,
        d.tagline || "",
        d.description || "",
        d.version || "",
        d.releaseDate || "",
        platforms,
        d.deliveryType,
        d.fileSize || null,
        d.access || null,
        d.downloadReady === "true",
        d.downloadUrl || null,
        JSON.stringify(screenshots),
        d.published === "true",
        id,
      ],
    );
  } catch (err) {
    console.error("Failed to update app:", err);
    return { status: "error", message: "Could not save — is the slug already used?" };
  }

  revalidatePath("/dashboard/apps");
  revalidatePath("/downloads");
  redirect("/dashboard/apps");
}

export async function deleteApp(id: number): Promise<void> {
  await query(`DELETE FROM apps WHERE id = $1`, [id]);
  revalidatePath("/dashboard/apps");
  revalidatePath("/downloads");
}
