"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { setHostingDemoAuthed } from "@/lib/dashboard-auth";
import { mockUser } from "@/lib/dashboard-mock";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
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

  function handleLogout() {
    setHostingDemoAuthed(false);
    router.replace("/dashboard/login");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-semibold tracking-wide text-paper transition-opacity hover:opacity-90"
      >
        {getInitials(mockUser.name)}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border border-ink/10 bg-paper-soft p-4 shadow-lg">
          <p className="text-sm font-medium text-ink">{mockUser.name}</p>
          <p className="text-xs text-ink-soft">{mockUser.email}</p>
          <span className="mt-2 inline-block rounded-sm bg-ink/5 px-2 py-0.5 text-xs text-ink-soft">
            {mockUser.plan} plan
          </span>

          <div className="mt-4 border-t border-ink/10 pt-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-ink-soft transition-colors hover:bg-ink/5 hover:text-accent-deep"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
