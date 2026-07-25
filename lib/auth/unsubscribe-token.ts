// Stateless one-click unsubscribe token — mirrors lib/auth/session.ts's
// Web Crypto HMAC pattern, but signed with its own UNSUBSCRIBE_SECRET
// (not SESSION_SECRET) so a leaked unsubscribe-signing key can't be used
// to forge session cookies, and vice versa. Verifiable without a DB
// round-trip or an active session — that's the entire point of one-click.
function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey | null> {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) return null;
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createUnsubscribeToken(userId: number): Promise<string | null> {
  const key = await getHmacKey();
  if (!key) return null;

  const payloadBytes = new TextEncoder().encode(String(userId));
  const signature = await crypto.subtle.sign("HMAC", key, payloadBytes);
  return base64UrlEncode(new Uint8Array(signature));
}

export async function verifyUnsubscribeToken(userId: number, token: string): Promise<boolean> {
  const key = await getHmacKey();
  if (!key) return false;

  try {
    const payloadBytes = new TextEncoder().encode(String(userId));
    return await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(token) as BufferSource,
      payloadBytes,
    );
  } catch {
    return false;
  }
}
