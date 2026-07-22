// One-time helper: creates the target database if it doesn't exist yet
// (Postgres has no "CREATE DATABASE IF NOT EXISTS"). Usage: npm run db:create
const { Client } = require("pg");
require("./load-env")();

async function main() {
  const client = new Client({
    host: process.env.PGHOST ?? "localhost",
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: "postgres",
  });
  await client.connect();
  const { rows } = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [process.env.PGDATABASE],
  );
  if (rows.length === 0) {
    await client.query(`CREATE DATABASE "${process.env.PGDATABASE}"`);
    console.log(`Created database ${process.env.PGDATABASE}`);
  } else {
    console.log(`Database ${process.env.PGDATABASE} already exists`);
  }
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
