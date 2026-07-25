import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/current-user";

// Deliberately NOT read from the root layout (see components/layout/header.tsx)
// — a Server Component reading cookies() there would force every page on the
// site to render dynamically, losing static generation for the entire
// marketing site just to personalize the header for signed-in users. This
// tiny endpoint is the dynamic part instead; the header fetches it client-side.
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
