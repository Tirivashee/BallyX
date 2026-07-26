import { query } from "@/lib/db";

/**
 * Downloadable apps shown on /downloads. Every row — including Pluto,
 * Mars, and Venus — lives in the `apps` table (see db/schema.sql,
 * db/seed-apps-data.js) and is editable, including photo uploads, from
 * /dashboard/apps. `downloadReady: false` renders the Download button as
 * a disabled "Coming soon" state rather than pretending to trigger a
 * file that doesn't exist; flip it in the admin form and set a
 * `downloadUrl` once a real installer is hosted.
 *
 * `detailHref` is where the download card's "View details" link goes.
 * Pluto already has a full marketing page — point it there instead of
 * duplicating that content at /downloads/pluto (the dynamic route still
 * redirects /downloads/pluto to /product too, for anyone who lands on
 * that URL directly). Other apps get a generic detail page rendered from
 * `screenshots`/`differentiators`/`features`/`faq` below.
 */
export type DownloadApp = {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  version: string;
  releaseDate: string;
  platforms: string[];
  /**
   * "desktop" apps (Pluto, Mars) ship an installer — the card/hero show a
   * file size and a "Download for {platform}" button. "cloud" apps (Venus)
   * are browser-based SaaS — there's no file to download, so the card shows
   * `access` instead of `fileSize` and the CTA reads "Coming soon" without
   * implying a file transfer. Defaults to "desktop" when omitted.
   */
  deliveryType?: "desktop" | "cloud";
  fileSize?: string;
  /** Cloud-only: shown in place of `fileSize`, e.g. "Web browser — no install". */
  access?: string;
  downloadReady: boolean;
  downloadUrl?: string;
  detailHref: string;
  screenshots: { src: string; alt: string; caption: string }[];
  /**
   * Optional deeper marketing content, same shape as `pluto.differentiators`
   * / `pluto.features` / `pluto.faq` in site-config.ts. Omit entirely for an
   * app that doesn't have this fleshed out yet (e.g. Venus) — the generic
   * /downloads/[app] page only renders a section when its data exists.
   */
  differentiators?: {
    id: string;
    eyebrow: string;
    title: string;
    summary: string;
    detail: string;
  }[];
  features?: { title: string; description: string }[];
  faq?: { question: string; answer: string }[];
};

type AppRow = {
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
  differentiators: NonNullable<DownloadApp["differentiators"]>;
  features: NonNullable<DownloadApp["features"]>;
  faq: NonNullable<DownloadApp["faq"]>;
};

function rowToDownloadApp(row: AppRow): DownloadApp {
  return {
    id: row.slug,
    name: row.name,
    icon: row.icon_url || "/images/app-icons/placeholder.svg",
    tagline: row.tagline,
    description: row.description,
    version: row.version,
    releaseDate: row.release_date,
    platforms: row.platforms,
    deliveryType: row.delivery_type,
    fileSize: row.file_size ?? undefined,
    access: row.access ?? undefined,
    downloadReady: row.download_ready,
    downloadUrl: row.download_url ?? undefined,
    // Pluto already has a full marketing page — send its "View details"
    // link there instead of the generic /downloads/[app] page.
    detailHref: row.slug === "pluto" ? "/product" : `/downloads/${row.slug}`,
    screenshots: row.screenshots ?? [],
    differentiators: row.differentiators.length ? row.differentiators : undefined,
    features: row.features.length ? row.features : undefined,
    faq: row.faq.length ? row.faq : undefined,
  };
}

/** Every published app, from the `apps` table — includes Pluto/Mars/Venus. */
export async function getPublishedApps(): Promise<DownloadApp[]> {
  const rows = await query<AppRow>(
    `SELECT slug, name, icon_url, tagline, description, version, release_date, platforms,
            delivery_type, file_size, access, download_ready, download_url, screenshots,
            differentiators, features, faq
     FROM apps WHERE published = true ORDER BY sort_order, id`,
  );
  return rows.map(rowToDownloadApp);
}

/** Everything /downloads should list. */
export async function getAllApps(): Promise<DownloadApp[]> {
  return getPublishedApps();
}
