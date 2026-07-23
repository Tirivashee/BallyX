// Shared connection config for the one-off db scripts (create/migrate/seed).
// Mirrors lib/db.ts: managed Postgres (Neon, Vercel Postgres, Supabase, RDS,
// ...) requires TLS and presents a cert `pg` won't chain-validate by
// default; local Postgres has neither. Inferred from the host so nothing
// else has to change between local and hosted.
function getPgConfig(overrides = {}) {
  const host = process.env.PGHOST ?? "localhost";
  return {
    host,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: host === "localhost" ? undefined : { rejectUnauthorized: false },
    ...overrides,
  };
}

module.exports = { getPgConfig };
