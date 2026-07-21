"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { isHostingDemoAuthed } from "@/lib/dashboard-auth";

/**
 * Gates everything under /dashboard except /dashboard/login behind the
 * fake local "auth" in lib/dashboard-auth.ts. This check only ever runs
 * client-side (there's no real session to check on the server), so the
 * gated content briefly shows a loading state on first paint.
 */
export function DashboardAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const ok = isHostingDemoAuthed();
    setAuthed(ok);
    setChecked(true);
    if (!ok && pathname !== "/dashboard/login") {
      router.replace("/dashboard/login");
    }
  }, [pathname, router]);

  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  if (!checked || !authed) {
    return (
      <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center">
        <p className="text-sm text-ink-soft">Checking session…</p>
      </div>
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}
