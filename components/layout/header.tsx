"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { brand, nav } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { BrandName } from "@/components/ui/brand-name";
import { AccountMenu } from "@/components/layout/account-menu";
import type { CurrentUser } from "@/lib/auth/current-user";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Fetched client-side rather than read from the root layout on the
  // server — reading the session cookie there would force every page on
  // the site to render dynamically (see app/api/me/route.ts), which would
  // cost this marketing site static generation everywhere just to
  // personalize the header for signed-in users. Defaults to signed-out
  // (the CTA) until this resolves, since most visitors are signed out.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setCurrentUser(data?.user ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-paper/55 backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_32px_-12px_rgba(21,22,26,0.18)]">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-heading text-xl font-semibold tracking-tight text-ink"
          onClick={() => setOpen(false)}
        >
          <BrandName text={brand.shortName} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent-deep",
                  active ? "text-ink" : "text-ink-soft",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          {currentUser ? (
            <AccountMenu user={currentUser} />
          ) : (
            <Button asChild size="sm">
              <Link href="/contact">Book a consultation</Link>
            </Button>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/50 md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-3 text-base font-medium text-ink hover:bg-ink/5"
                >
                  {item.label}
                </Link>
              ))}
              {currentUser ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-3 text-base font-medium text-ink hover:bg-ink/5"
                  >
                    Account settings
                  </Link>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="w-full rounded-md px-2 py-3 text-left text-base font-medium text-ink hover:bg-ink/5"
                    >
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <Button asChild className="mt-2 w-full">
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    Book a consultation
                  </Link>
                </Button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
