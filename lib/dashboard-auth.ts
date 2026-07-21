/**
 * Fake, front-end-only "auth" for the hosting dashboard preview. There is
 * no backend, database, or real session yet — this just gates the demo
 * UI behind a login screen so it isn't wide open. Do not build real
 * security expectations on top of this; replace entirely once the
 * dashboard is backed by a real API.
 */
const STORAGE_KEY = "ballyx-hosting-demo-auth";

export function isHostingDemoAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function setHostingDemoAuthed(authed: boolean): void {
  if (typeof window === "undefined") return;
  if (authed) {
    window.localStorage.setItem(STORAGE_KEY, "true");
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
