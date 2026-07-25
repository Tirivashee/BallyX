"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogOut, User } from "lucide-react";

import { getAvatarSrc } from "@/lib/account/avatars";
import { logout } from "@/lib/actions/auth";
import type { CurrentUser } from "@/lib/auth/current-user";

// Mirrors the outside-click/Escape-to-close pattern already solved in
// components/dashboard/user-menu.tsx, for the same interaction on the
// public header's account menu.
export function AccountMenu({ user }: { user: CurrentUser }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-ink/10 transition-opacity hover:opacity-90"
      >
        <Image
          src={getAvatarSrc(user.avatarKey)}
          alt=""
          width={40}
          height={40}
          unoptimized
        />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-ink/10 bg-paper-soft p-4 shadow-lg">
          <p className="text-sm font-medium text-ink">{user.displayName || "Your account"}</p>
          <p className="truncate text-xs text-ink-soft">{user.email}</p>

          <div className="mt-3 border-t border-ink/10 pt-3">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-ink-soft transition-colors hover:bg-ink/5 hover:text-accent-deep"
            >
              <User className="h-4 w-4" />
              Account settings
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-ink-soft transition-colors hover:bg-ink/5 hover:text-accent-deep"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
