// Signed session cookie, verifiable in both the Node runtime (Server
// Actions, Route Handlers) and the Edge runtime (middleware.ts) — so it
// only uses Web Crypto (`crypto.subtle`), never Node's `crypto` module.
//
// Format: `${base64url(payload json)}.${base64url(hmac-sha256 signature)}`
// The payload just proves "this request holds a cookie signed with our
// secret" — there's a single admin account, so there's no user id to carry.

export const SESSION_COOKIE = "ballyx_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

interface SessionPayload {
  sub: "admin";
  iat: number;
}

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

/** Mint a new signed session token. Returns null if SESSION_SECRET isn't configured. */
export async function createSessionToken(): Promise<string | null> {
  const key = await getHmacKey();
  if (!key) return null;

  const payload: SessionPayload = { sub: "admin", iat: Math.floor(Date.now() / 1000) };
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const payloadPart = base64UrlEncode(payloadBytes);

  const signature = await crypto.subtle.sign("HMAC", key, payloadBytes);
  const signaturePart = base64UrlEncode(new Uint8Array(signature));

  return `${payloadPart}.${signaturePart}`;
}

/** Verify a session token's signature and freshness. */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const key = await getHmacKey();
  if (!key) return false;

  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return false;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadPart)));
  } catch {
    return false;
  }
  if (payload?.sub !== "admin" || typeof payload.iat !== "number") return false;

  const ageSeconds = Math.floor(Date.now() / 1000) - payload.iat;
  if (ageSeconds < 0 || ageSeconds > SESSION_MAX_AGE_SECONDS) return false;

  // Must verify against the same bytes that were signed — the raw JSON
  // payload bytes, not a re-encoding of the base64url string.
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(signaturePart) as BufferSource,
    base64UrlDecode(payloadPart) as BufferSource
  );
  return valid;
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
