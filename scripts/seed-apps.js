// Inserts Pluto/Mars/Venus into the `apps` table (see db/seed-apps-data.js).
// Uses parameterized queries rather than raw SQL so none of that copy needs
// hand-escaping. ON CONFLICT (slug) DO NOTHING — safe to re-run, never
// overwrites an edit made afterward through /dashboard/apps.
// Usage: npm run db:seed-apps
const { Pool } = require("pg");
require("./load-env")();
const { getPgConfig } = require("./pg-config");
const apps = require("../db/seed-apps-data");

async function main() {
  const pool = new Pool(getPgConfig());

  try {
    for (const app of apps) {
      const result = await pool.query(
        `INSERT INTO apps
           (slug, name, icon_url, tagline, description, version, release_date, platforms,
            delivery_type, file_size, access, download_ready, download_url, screenshots,
            differentiators, features, faq, published, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
         ON CONFLICT (slug) DO NOTHING
         RETURNING slug`,
        [
          app.slug,
          app.name,
          app.iconUrl,
          app.tagline,
          app.description,
          app.version,
          app.releaseDate,
          app.platforms,
          app.deliveryType,
          app.fileSize,
          app.access,
          app.downloadReady,
          app.downloadUrl,
          JSON.stringify(app.screenshots),
          JSON.stringify(app.differentiators),
          JSON.stringify(app.features),
          JSON.stringify(app.faq),
          app.published,
          app.sortOrder,
        ],
      );
      console.log(
        result.rows[0]
          ? `Inserted "${app.slug}".`
          : `Skipped "${app.slug}" — already exists.`,
      );
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Seeding apps failed:", err);
  process.exit(1);
});
