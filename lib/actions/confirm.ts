"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { hashToken } from "@/lib/auth/tokens";
import { query } from "@/lib/db";

const ConfirmSchema = z.object({
  token: z.string().min(1),
});

export type ConfirmState = {
  // "invalid" covers unknown, expired, already-used tokens, and
  // rate-limited attempts alike — deliberately indistinguishable (see
  // invariant 4: rowCount === 0 must look the same for every reason).
  status: "idle" | "invalid";
};

export async function confirmEmail(
  _prevState: ConfirmState,
  formData: FormData,
): Promise<ConfirmState> {
  const parsed = ConfirmSchema.safeParse({ token: formData.get("token") });
  if (!parsed.success) {
    return { status: "invalid" };
  }

  const ip = await getClientIp();
  const allowed = await checkRateLimit(`confirm:ip:${ip}`, 20);
  if (!allowed) {
    return { status: "invalid" };
  }

  const tokenHash = hashToken(parsed.data.token);

  // Single atomic statement — a read-then-write here would leave a
  // window where two concurrent requests both see the token as unused.
  const rows = await query<{ user_id: number }>(
    `UPDATE email_verification_tokens
     SET consumed_at = now()
     WHERE token_hash = $1 AND consumed_at IS NULL AND expires_at > now()
     RETURNING user_id`,
    [tokenHash],
  );

  if (rows.length === 0) {
    return { status: "invalid" };
  }

  await query(`UPDATE users SET email_verified_at = now() WHERE id = $1`, [rows[0].user_id]);

  // No session is created here — an emailed link that logged you in would
  // be a permanent bearer credential sitting in an inbox.
  redirect("/signin?confirmed=1");
}
