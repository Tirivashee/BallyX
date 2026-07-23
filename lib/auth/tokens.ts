// Email-verification tokens. The raw token exists only in the emailed
// URL — the database only ever sees its sha256 hash, as a `bytea` so
// lookups hit the primary key index rather than a string compare.
import { randomBytes, createHash } from "node:crypto";

export const EMAIL_VERIFICATION_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/** A high-entropy, single-use, URL-safe token for the confirmation link. */
export function generateRawToken(): string {
  return randomBytes(32).toString("base64url");
}

/** sha256 of the raw token, as a Buffer — bind directly to a bytea param. */
export function hashToken(raw: string): Buffer {
  return createHash("sha256").update(raw).digest();
}
