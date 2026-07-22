"use client";

// Client-only invoice-number auto-increment. There's no backend/database for
// this tool (see README — "No persistence"), so the running counter lives in
// the browser's localStorage: per-device, per-browser, resets daily by design
// (the number itself is stamped with the date, e.g. BX-INV-260722-3).

const STORAGE_KEY = "ballyx-invoice-seq";

interface StoredSeq {
  stamp: string;
  seq: number;
}

function todayStamp(): string {
  const d = new Date();
  return (
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0")
  );
}

function readStored(): StoredSeq | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredSeq>;
    if (typeof parsed.stamp === "string" && typeof parsed.seq === "number") {
      return parsed as StoredSeq;
    }
  } catch {
    /* ignore malformed/blocked storage */
  }
  return null;
}

/** The invoice number that would be used *next*, without consuming it. */
export function peekInvoiceNo(): string {
  const stamp = todayStamp();
  const stored = readStored();
  const seq = stored && stored.stamp === stamp ? stored.seq : 1;
  return `BX-INV-${stamp}-${seq}`;
}

/** Advance the counter once a number has actually been used (a PDF was downloaded). */
export function advanceInvoiceSequence(): void {
  if (typeof window === "undefined") return;
  const stamp = todayStamp();
  const stored = readStored();
  const seq = stored && stored.stamp === stamp ? stored.seq : 1;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ stamp, seq: seq + 1 } satisfies StoredSeq)
    );
  } catch {
    /* storage unavailable (private mode, quota) — numbering just won't persist */
  }
}
