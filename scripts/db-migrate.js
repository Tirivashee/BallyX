// Applies db/schema.sql against the database configured via PG* env vars.
// Usage: npm run db:migrate
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("./load-env")();

async function main() {
  const pool = new Pool({
    host: process.env.PGHOST ?? "localhost",
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  });

  const sql = fs.readFileSync(path.join(__dirname, "..", "db", "schema.sql"), "utf8");

  try {
    await pool.query(sql);
    console.log("Migration applied successfully.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
