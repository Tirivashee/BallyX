"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, Package, FileText, Mail } from "lucide-react";

import { BrandName } from "@/components/ui/brand-name";
import { UserMenu } from "@/components/dashboard/user-menu";
import { cn } from "@/lib/utils";

const dashboardNav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Apps", href: "/dashboard/apps", icon: Package },
  { label: "Blog", href: "/dashboard/blog", icon: FileText },
  { label: "Newsletter", href: "/dashboard/newsletter", icon: Mail },
  { label: "Invoice", href: "/dashboard/invoice", icon: Receipt },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = dashboardNav.find((item) => isActive(pathname, item.href));

  return (
    // h-screen + overflow-hidden on the shell, with only <main> scrolling
    // below, is what makes this read as a contained app (Vercel/Linear-
    // style) rather than a page — the sidebar and top bar stay fixed.
    <div className="flex h-screen overflow-hidden bg-paper-dim">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink/10 bg-paper-soft lg:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-ink/10 px-6">
          <span className="font-heading text-lg font-semibold tracking-tight text-ink">
            <BrandName text="BallyX Admin" />
          </span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {dashboardNav.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-ink text-paper" : "text-ink-soft hover:bg-ink/5",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-ink/10 bg-paper-soft px-4 lg:px-6">
          <span className="font-heading text-lg font-semibold tracking-tight text-ink lg:hidden">
            <BrandName text="BallyX Admin" />
          </span>
          <p className="hidden text-sm font-medium text-ink-soft lg:block">
            {current?.label ?? "Dashboard"}
          </p>
          <UserMenu />
        </header>

        <nav className="flex shrink-0 gap-2 overflow-x-auto border-b border-ink/10 bg-paper-soft px-4 py-2 lg:hidden">
          {dashboardNav.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-ink text-paper" : "text-ink-soft hover:bg-ink/5",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
