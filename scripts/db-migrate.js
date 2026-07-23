// Applies db/schema.sql against the database configured via PG* env vars.
// Usage: npm run db:migrate
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("./load-env")();
const { getPgConfig } = require("./pg-config");

async function main() {
  const pool = new Pool(getPgConfig());

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
