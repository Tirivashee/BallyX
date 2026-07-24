"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe2,
  ShieldCheck,
  Archive,
  Activity,
  CreditCard,
  LifeBuoy,
  Settings,
  Receipt,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { BrandName } from "@/components/ui/brand-name";
import { UserMenu } from "@/components/dashboard/user-menu";
import { cn } from "@/lib/utils";

const dashboardNav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Sites", href: "/dashboard/sites", icon: Globe2 },
  { label: "Domains & SSL", href: "/dashboard/domains", icon: ShieldCheck },
  { label: "Backups", href: "/dashboard/backups", icon: Archive },
  { label: "Activity", href: "/dashboard/activity", icon: Activity },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
  { label: "Invoice", href: "/dashboard/invoice", icon: Receipt },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-paper-dim">
      <div className="border-b border-ink/10 bg-paper-soft">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            <span className="font-heading text-lg font-semibold tracking-tight text-ink">
              <BrandName text="BallyX Hosting" />
            </span>
            <Badge variant="teal">Demo preview — UI only</Badge>
          </div>
          <UserMenu />
        </Container>
      </div>

      <Container className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {dashboardNav.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-ink text-paper"
                    : "text-ink-soft hover:bg-ink/5",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div>{children}</div>
      </Container>
    </div>
  );
}
