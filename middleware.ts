import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, getSessionSubject } from "@/lib/auth/session";

const PROTECTED_PAGE_PREFIXES = ["/dashboard", "/tools/invoice"];
const PROTECTED_API_PREFIXES = ["/api/invoice"];

// /dashboard and /tools/invoice hold real shared business data (invoice
// settings, the customer directory) and stay admin-only. A self-signed-up,
// confirmed user is a real authenticated session, but not admin — it does
// not unlock these routes. See lib/auth/session.ts.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p));
  const isPage = PROTECTED_PAGE_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isApi && !isPage) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const subject = await getSessionSubject(token);
  if (subject?.sub === "admin") return NextResponse.next();

  if (isApi) {
    return NextResponse.json({ error: subject ? "Forbidden." : "Unauthorized." }, {
      status: subject ? 403 : 401,
    });
  }

  if (subject) {
    // Authenticated as a non-admin user — not logged out, just not
    // authorized for this route. Send them home rather than back to a
    // sign-in page they've already passed.
    return NextResponse.redirect(new URL("/", req.url));
  }

  const signinUrl = new URL("/signin", req.url);
  signinUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(signinUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/tools/invoice/:path*", "/api/invoice/:path*"],
};
