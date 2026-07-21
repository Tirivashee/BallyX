import type { Metadata } from "next";

import { DashboardAuthGate } from "@/components/dashboard/dashboard-auth-gate";

export const metadata: Metadata = {
  title: "Client dashboard (demo)",
  description:
    "Preview of the BallyX Hosting client dashboard — UI only, not connected to real infrastructure yet.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardAuthGate>{children}</DashboardAuthGate>;
}
