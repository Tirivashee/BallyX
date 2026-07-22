import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

const PROTECTED_PAGE_PREFIXES = ["/dashboard", "/tools/invoice"];
const PROTECTED_API_PREFIXES = ["/api/invoice"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p));
  const isPage = PROTECTED_PAGE_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isApi && !isPage) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const authed = await verifySessionToken(token);
  if (authed) return NextResponse.next();

  if (isApi) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/tools/invoice/:path*", "/api/invoice/:path*"],
};
