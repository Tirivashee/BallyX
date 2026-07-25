"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hash as hashPassword, verify as verifyPasswordHash } from "@node-rs/argon2";
import { z } from "zod";

import { isAvatarKey } from "@/lib/account/avatars";
import { normalizeEmail } from "@/lib/auth/email";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { SESSION_COOKIE, getSessionSubject } from "@/lib/auth/session";
import { query } from "@/lib/db";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

// Every action here is reachable directly (Server Actions are callable
// endpoints, not just form handlers a UI happens to point at), so each
// re-checks the session itself rather than trusting that only middleware
// ever gated the page that renders the form.
async function requireUserId(): Promise<number | null> {
  const jar = await cookies();
  const subject = await getSessionSubject(jar.get(SESSION_COOKIE)?.value);
  return subject?.sub === "user" && subject.uid ? subject.uid : null;
}

const ProfileSchema = z.object({
  displayName: z.string().trim().max(100).optional().or(z.literal("")),
  avatarKey: z.string().refine(isAvatarKey, "Please pick an avatar."),
  newsletterSubscribed: z.enum(["true", "false"]),
});

export async function updateProfile(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) return { status: "error", message: "Please sign in again." };

  const parsed = ProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    avatarKey: formData.get("avatarKey"),
    newsletterSubscribed: formData.get("newsletterSubscribed"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields." };
  }

  const { displayName, avatarKey } = parsed.data;
  const subscribed = parsed.data.newsletterSubscribed === "true";

  await query(
    `UPDATE users
     SET display_name = $1,
         avatar_key = $2,
         newsletter_subscribed = $3,
         newsletter_unsubscribed_at = CASE WHEN $3 THEN NULL ELSE now() END
     WHERE id = $4 AND deleted_at IS NULL`,
    [displayName || null, avatarKey, subscribed, userId],
  );

  revalidatePath("/account");
  revalidatePath("/", "layout");
  return { status: "success", message: "Profile updated." };
}

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: z.string().min(8, "New password must be at least 8 characters.").max(200),
});

export async function changePassword(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) return { status: "error", message: "Please sign in again." };

  const allowed = await checkRateLimit(`account:change-password:${userId}`, 10);
  if (!allowed) {
    return { status: "error", message: "Too many attempts. Try again later." };
  }

  const parsed = ChangePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the highlighted fields.",
    };
  }

  const rows = await query<{ password_hash: string }>(
    `SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [userId],
  );
  const user = rows[0];
  if (!user || !(await verifyPasswordHash(user.password_hash, parsed.data.currentPassword))) {
    return { status: "error", message: "Current password is incorrect." };
  }

  const newHash = await hashPassword(parsed.data.newPassword);
  await query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [newHash, userId]);

  return { status: "success", message: "Password updated." };
}

const DeleteAccountSchema = z.object({
  confirmEmail: z.string().trim().email(),
});

export async function deleteAccount(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) return { status: "error", message: "Please sign in again." };

  const parsed = DeleteAccountSchema.safeParse({ confirmEmail: formData.get("confirmEmail") });
  if (!parsed.success) {
    return { status: "error", message: "Enter your account email to confirm." };
  }
  const confirmEmail = normalizeEmail(parsed.data.confirmEmail);

  const rows = await query<{ email: string }>(
    `SELECT email FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [userId],
  );
  const user = rows[0];
  if (!user || user.email !== confirmEmail) {
    return { status: "error", message: "That doesn't match your account email." };
  }

  // Soft-delete/anonymize rather than a hard DELETE: frees the email up
  // for a future signup while keeping newsletter_send_recipients rows
  // referentially intact (see db/schema.sql's users comment).
  await query(
    `UPDATE users
     SET email = 'deleted-' || id || '@deleted.ballyx.invalid',
         password_hash = '',
         display_name = NULL,
         avatar_key = NULL,
         newsletter_subscribed = false,
         newsletter_unsubscribed_at = now(),
         deleted_at = now()
     WHERE id = $1`,
    [userId],
  );

  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/");
}
