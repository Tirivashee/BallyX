// Populates the dashboard demo tables from db/seed.sql.
// Usage: npm run db:seed
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

  const sql = fs.readFileSync(path.join(__dirname, "..", "db", "seed.sql"), "utf8");

  try {
    await pool.query(sql);
    console.log("Seed data inserted successfully.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
