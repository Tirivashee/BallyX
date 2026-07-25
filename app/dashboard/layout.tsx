import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — BallyX Admin" },
  description: "BallyX admin console — apps, blog, newsletter, and invoicing.",
  robots: { index: false, follow: false },
};

// Access is already gated server-side by middleware.ts (real signed-cookie
// session check) before this layout ever renders — no client-side check
// needed here.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
