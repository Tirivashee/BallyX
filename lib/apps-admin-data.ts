// Read-side queries for /dashboard/apps. Deliberately not in
// lib/actions/apps-admin.ts (a "use server" module, where every export
// becomes a callable action) — these are plain reads, only ever imported
// from Server Components.
import { query } from "@/lib/db";

export type AdminApp = {
  id: number;
  slug: string;
  name: string;
  iconUrl: string | null;
  tagline: string;
  description: string;
  version: string;
  releaseDate: string;
  platforms: string[];
  deliveryType: "desktop" | "cloud";
  fileSize: string | null;
  access: string | null;
  downloadReady: boolean;
  downloadUrl: string | null;
  screenshots: { src: string; alt: string; caption: string }[];
  published: boolean;
};

type AppRow = {
  id: number;
  slug: string;
  name: string;
  icon_url: string | null;
  tagline: string;
  description: string;
  version: string;
  release_date: string;
  platforms: string[];
  delivery_type: "desktop" | "cloud";
  file_size: string | null;
  access: string | null;
  download_ready: boolean;
  download_url: string | null;
  screenshots: { src: string; alt: string; caption: string }[];
  published: boolean;
};

function rowToAdminApp(row: AppRow): AdminApp {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    iconUrl: row.icon_url,
    tagline: row.tagline,
    description: row.description,
    version: row.version,
    releaseDate: row.release_date,
    platforms: row.platforms,
    deliveryType: row.delivery_type,
    fileSize: row.file_size,
    access: row.access,
    downloadReady: row.download_ready,
    downloadUrl: row.download_url,
    screenshots: row.screenshots ?? [],
    published: row.published,
  };
}

export async function getAdminApps(): Promise<AdminApp[]> {
  const rows = await query<AppRow>(
    `SELECT id, slug, name, icon_url, tagline, description, version, release_date, platforms,
            delivery_type, file_size, access, download_ready, download_url, screenshots, published
     FROM apps ORDER BY sort_order, id`,
  );
  return rows.map(rowToAdminApp);
}

export async function getAdminAppById(id: number): Promise<AdminApp | null> {
  const rows = await query<AppRow>(
    `SELECT id, slug, name, icon_url, tagline, description, version, release_date, platforms,
            delivery_type, file_size, access, download_ready, download_url, screenshots, published
     FROM apps WHERE id = $1`,
    [id],
  );
  return rows[0] ? rowToAdminApp(rows[0]) : null;
}
