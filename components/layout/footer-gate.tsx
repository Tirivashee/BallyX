"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/footer";

// /dashboard is a fully separate, full-screen admin app shell (see
// components/dashboard/dashboard-shell.tsx) — it must never show the
// marketing footer. Footer itself has no interactivity of its own, so
// this thin client wrapper is the only reason it isn't rendered directly
// from the (server) root layout.
export function FooterGate() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;
  return <Footer />;
}
