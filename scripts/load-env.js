// Minimal .env.local loader for standalone scripts (migrate/seed), which run
// outside Next.js and so don't get its built-in env loading for free.
const fs = require("fs");
const path = require("path");

module.exports = function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // `vercel env pull` writes values double-quoted (dotenv convention);
    // Next.js's own env loader strips this automatically, but this
    // standalone loader didn't — strip a single matching pair so
    // PGHOST etc. don't end up as the literal string `"localhost"`.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};
