import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Client dashboard (demo)",
  description:
    "Preview of the BallyX Hosting client dashboard — UI only, not connected to real infrastructure yet.",
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
