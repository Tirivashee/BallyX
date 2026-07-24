import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, getSessionSubject, type SessionSubject } from "@/lib/auth/session";

type Role = SessionSubject["sub"];
type Rule = { prefixes: string[]; requires: Role };

// /dashboard (including the invoice tool at /dashboard/invoice) holds real
// shared business data — invoice settings, the customer directory — and
// stays admin-only. /account is the mirror image: it's where a confirmed
// self-signup user manages their own profile/newsletter/account, and an
// admin session (which has no `users` row at all) doesn't unlock it either.
// See lib/auth/session.ts.
const PAGE_RULES: Rule[] = [
  { prefixes: ["/dashboard"], requires: "admin" },
  { prefixes: ["/account"], requires: "user" },
];
const API_RULES: Rule[] = [{ prefixes: ["/api/invoice"], requires: "admin" }];

function matchRule(rules: Rule[], pathname: string): Rule | undefined {
  return rules.find((rule) => rule.prefixes.some((prefix) => pathname.startsWith(prefix)));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const apiRule = matchRule(API_RULES, pathname);
  const pageRule = matchRule(PAGE_RULES, pathname);
  if (!apiRule && !pageRule) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const subject = await getSessionSubject(token);
  const rule = (apiRule ?? pageRule)!;

  if (subject?.sub === rule.requires) return NextResponse.next();

  if (apiRule) {
    return NextResponse.json({ error: subject ? "Forbidden." : "Unauthorized." }, {
      status: subject ? 403 : 401,
    });
  }

  if (subject) {
    // Signed in, but the wrong role for this route — not logged out, just
    // not authorized here. Send each role back to where it actually
    // belongs rather than to a route it can't use.
    const home = subject.sub === "admin" ? "/dashboard" : "/";
    return NextResponse.redirect(new URL(home, req.url));
  }

  // No session at all — send to the sign-in page that matches what this
  // route requires (admin login lives at /login, separate from the
  // self-signup /signin), both of which already support ?next=.
  const signinPath = rule.requires === "admin" ? "/login" : "/signin";
  const signinUrl = new URL(signinPath, req.url);
  signinUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(signinUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/api/invoice/:path*"],
};
