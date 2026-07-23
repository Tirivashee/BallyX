// Plain sync helper — deliberately NOT in a "use server" file. Every
// export of a "use server" module must itself be an async Server Action,
// so this can't live alongside login()/logout() in lib/actions/auth.ts.
/** Only allow same-app relative paths — never redirect off-site. */
export function safeNextPath(raw: FormDataEntryValue | null, fallback: string): string {
  const value = typeof raw === "string" ? raw : "";
  return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
