"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShieldCheck, Trash2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const accountNav = [
  { label: "Profile", href: "/account", icon: User },
  { label: "Security", href: "/account/security", icon: ShieldCheck },
  { label: "Delete account", href: "/account/delete", icon: Trash2 },
] as const;

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-paper-dim">
      <Container className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-[200px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {accountNav.map((item) => {
            const active = pathname === item.href;
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

        <div>{children}</div>
      </Container>
    </div>
  );
}
