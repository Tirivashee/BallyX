"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { safeNextPath } from "@/lib/auth/next-path";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  getSessionSubject,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/auth/session";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
};

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"), "/dashboard");

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    console.error("ADMIN_USERNAME / ADMIN_PASSWORD_HASH are not configured.");
    return { status: "error", message: "Sign-in isn't configured yet. Contact the site owner." };
  }

  const validUsername = username === adminUsername;
  const validPassword = await verifyPassword(password, adminPasswordHash);

  if (!validUsername || !validPassword) {
    return { status: "error", message: "Incorrect username or password." };
  }

  const token = await createSessionToken();
  if (!token) {
    console.error("SESSION_SECRET is not configured.");
    return { status: "error", message: "Sign-in isn't configured yet. Contact the site owner." };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions);

  redirect(next);
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  const subject = await getSessionSubject(jar.get(SESSION_COOKIE)?.value);
  jar.delete(SESSION_COOKIE);
  redirect(subject?.sub === "user" ? "/signin" : "/login");
}
