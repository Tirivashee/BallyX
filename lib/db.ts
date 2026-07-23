import { Pool } from "pg";

// A single pooled connection, reused across hot reloads in dev (Next.js
// dev mode re-executes modules on every edit; without caching on `global`
// each reload would leak a fresh pool and eventually exhaust Postgres'
// max_connections).
declare global {
  var _pgPool: Pool | undefined;
}

const pgHost = process.env.PGHOST ?? "localhost";

export const pool =
  global._pgPool ??
  new Pool({
    host: pgHost,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    max: 10,
    // Managed Postgres (Neon, Vercel Postgres, Supabase, RDS, ...) requires
    // TLS and presents a cert `pg` won't chain-validate by default; local
    // Postgres has neither. Inferred from the host rather than a separate
    // env var — nothing else needs to change to go from local to hosted.
    ssl: pgHost === "localhost" ? undefined : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}
