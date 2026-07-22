// Password hashing for the single admin account. Node-only (uses Node's
// `crypto.scrypt`, not Web Crypto) — only ever imported from Server Actions
// / Route Handlers, never from middleware.ts (Edge) or client components.
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

/** Hash a plaintext password as `${saltHex}:${hashHex}`, for storing in ADMIN_PASSWORD_HASH. */
export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scryptAsync(plain, salt, KEY_LENGTH)) as Buffer;
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

/** Verify a plaintext password against a `${saltHex}:${hashHex}` stored hash. */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const derived = (await scryptAsync(plain, salt, KEY_LENGTH)) as Buffer;

  return expected.length === derived.length && timingSafeEqual(expected, derived);
}
