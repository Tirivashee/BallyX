// Signed session cookie, verifiable in both the Node runtime (Server
// Actions, Route Handlers) and the Edge runtime (middleware.ts) — so it
// only uses Web Crypto (`crypto.subtle`), never Node's `crypto` module.
//
// Format: `${base64url(payload json)}.${base64url(hmac-sha256 signature)}`
// The payload proves "this request holds a cookie signed with our
// secret" for one of two identities that share this cookie: the single
// shared admin account, or a real signed-up-and-confirmed user (`uid`
// referencing `users.id`). Both write the same cookie — only one
// identity is ever active in a given browser at a time, which is fine
// since nothing needs to be both simultaneously. A confirmed user
// session is NOT admin: middleware.ts still requires sub = "admin" for
// /dashboard, and (separately) sub = "user" for /account — a confirmed
// user never unlocks /dashboard, an admin session never unlocks /account.

export const SESSION_COOKIE = "ballyx_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

interface SessionPayload {
  sub: "admin" | "user";
  uid?: number;
  iat: number;
}

export type SessionSubject = { sub: "admin" | "user"; uid?: number };

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    value.length + ((4 - (value.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Mint a new signed session token — fresh every call (fresh `iat`), so a
 * sign-in always rotates the cookie's value rather than reusing one.
 * No `uid` → admin session. Returns null if SESSION_SECRET isn't configured.
 */
export async function createSessionToken(uid?: number): Promise<string | null> {
  const key = await getHmacKey();
  if (!key) return null;

  const payload: SessionPayload =
    uid === undefined
      ? { sub: "admin", iat: Math.floor(Date.now() / 1000) }
      : { sub: "user", uid, iat: Math.floor(Date.now() / 1000) };
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const payloadPart = base64UrlEncode(payloadBytes);

  const signature = await crypto.subtle.sign("HMAC", key, payloadBytes);
  const signaturePart = base64UrlEncode(new Uint8Array(signature));

  return `${payloadPart}.${signaturePart}`;
}

/**
 * Verify a session token's signature and freshness, returning the
 * decoded identity (or null). Signature-only — no DB call, no KDF — so
 * it stays safe to call from the Edge runtime (middleware.ts).
 */
export async function getSessionSubject(
  token: string | undefined | null
): Promise<SessionSubject | null> {
  if (!token) return null;
  const key = await getHmacKey();
  if (!key) return null;

  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadPart)));
  } catch {
    return null;
  }
  if ((payload?.sub !== "admin" && payload?.sub !== "user") || typeof payload.iat !== "number") {
    return null;
  }

  const ageSeconds = Math.floor(Date.now() / 1000) - payload.iat;
  if (ageSeconds < 0 || ageSeconds > SESSION_MAX_AGE_SECONDS) return null;

  // Must verify against the same bytes that were signed — the raw JSON
  // payload bytes, not a re-encoding of the base64url string.
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(signaturePart) as BufferSource,
    base64UrlDecode(payloadPart) as BufferSource
  );
  if (!valid) return null;

  return payload.sub === "admin" ? { sub: "admin" } : { sub: "user", uid: payload.uid };
}

// `NODE_ENV === "production"` is also true for a local `next start` over
// plain HTTP, where a `Secure` cookie would silently get dropped by the
// browser and break login. Key off an actual-HTTPS signal (Vercel sets
// `VERCEL=1` in every deployment) instead.
export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.VERCEL === "1",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
