import type { Metadata } from "next";

import { AccountShell } from "@/components/account/account-shell";

export const metadata: Metadata = {
  title: { default: "Your account", template: "%s — Account" },
  robots: { index: false, follow: false },
};

// Access is already gated server-side by middleware.ts (sub === "user")
// before this layout ever renders.
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
