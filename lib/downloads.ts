import { pluto } from "@/lib/site-config";

/**
 * Downloadable apps shown on /downloads. Every app currently has
 * `downloadReady: false` — there are no real installer files in the repo
 * yet, so the Download button renders as a disabled "Coming soon" state
 * rather than pretending to trigger a file that doesn't exist. Flip it
 * to `true` and point `downloadUrl` at a real file once one is hosted.
 *
 * Version/release date/file size are explicitly placeholder for all
 * three apps (see the {{...}} convention note in site-config.ts) — none
 * of these facts are confirmed anywhere yet, including for Pluto.
 *
 * `detailHref` is where the download card's "View details" link goes.
 * Pluto's already has a full marketing page — point it there instead of
 * duplicating that content at /downloads/pluto (the dynamic route still
 * redirects /downloads/pluto to /product too, for anyone who lands on
 * that URL directly). Mars and Venus get a generic detail page rendered
 * from `screenshots` below, since neither has a dedicated page yet.
 */
export type DownloadApp = {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  version: string;
  releaseDate: string;
  platforms: string[];
  fileSize: string;
  downloadReady: boolean;
  downloadUrl?: string;
  detailHref: string;
  screenshots: { src: string; alt: string; caption: string }[];
  /**
   * Optional deeper marketing content, same shape as `pluto.differentiators`
   * / `pluto.features` / `pluto.faq` in site-config.ts. Omit entirely for an
   * app that doesn't have this fleshed out yet (e.g. Venus) — the generic
   * /downloads/[app] page only renders a section when its data exists.
   */
  differentiators?: {
    id: string;
    eyebrow: string;
    title: string;
    summary: string;
    detail: string;
  }[];
  features?: { title: string; description: string }[];
  faq?: { question: string; answer: string }[];
};

export const downloads: DownloadApp[] = [
  {
    id: "pluto",
    name: pluto.name,
    icon: "/images/app-icons/pluto.png",
    tagline: pluto.tagline,
    description: pluto.subhead,
    version: "1.0.0", // {{PLUTO_VERSION}}
    releaseDate: "27 August 2025", // {{PLUTO_RELEASE_DATE}}
    platforms: ["Windows 10/11"],
    fileSize: "3.4 MB",
    downloadReady: false,
    detailHref: "/product",
    screenshots: [],
  },
  {
    id: "mars",
    name: "Mars",
    icon: "/images/app-icons/mars.png",
    tagline: "Production planning that knows what's actually on your shelf.",
    description:
      "Mars is a micro-production and material-costing companion to Pluto — it turns your raw-materials stock into bills of materials and production forecasts, using the same inventory Pluto already tracks.",
    version: "0.1.0", // {{MARS_VERSION}} — matches package.json/tauri.conf.json today; still pre-release
    releaseDate: "21 October 2026", // not yet built/packaged, no date to confirm
    platforms: ["Windows 10/11"],
    fileSize: "7.98 MB", // no installer built yet
    downloadReady: false,
    detailHref: "/downloads/mars",
    screenshots: [
      {
        src: "/images/screenshots/mars-overview.svg",
        alt: "Placeholder screenshot of the Mars overview screen",
        caption: "Overview",
      },
      {
        src: "/images/screenshots/mars-detail.svg",
        alt: "Placeholder screenshot of a Mars detail view",
        caption: "Detail view",
      },
    ],
    differentiators: [
      {
        id: "shared-inventory",
        eyebrow: "01 — NO DOUBLE ENTRY",
        title: "Reads the inventory you already have in Pluto",
        summary:
          "Mars doesn't ask you to stock-take twice. It reads the same raw-materials ledger Pluto already maintains, so bills of materials and costings stay accurate without a parallel spreadsheet.",
        detail:
          "There's no separate Mars inventory to keep in sync. Add or adjust raw-material stock in Pluto and every bill of materials, cost, and forecast in Mars reflects it immediately.",
      },
      {
        id: "bom-costing",
        eyebrow: "02 — COSTING",
        title: "Real per-unit costs, built from a bill of materials",
        summary:
          "Every finished product is defined as a recipe of raw materials and quantities. Mars recalculates true cost-per-unit automatically whenever an input price changes — no manual re-costing in a spreadsheet.",
        detail:
          "Raw-material price rises are one of the easiest ways a small manufacturer quietly loses margin. Mars ties finished-product costing directly to current input prices, so a costing sheet from three months ago is never the number you're actually working from.",
      },
      {
        id: "production-forecast",
        eyebrow: "03 — FORECASTING",
        title: "Know what you can actually make before you commit",
        summary:
          "Mars checks a planned production run against current raw-material stock and tells you what's achievable today, and what's short — before time and labour are already spent.",
        detail:
          "Instead of finding out mid-run that you're short one ingredient, Mars flags shortfalls against your bill of materials up front, against the same stock levels Pluto is tracking in real time.",
      },
    ],
    features: [
      {
        title: "Bills of materials",
        description:
          "Define finished products as a recipe of raw materials and quantities, kept in sync with Pluto's stock.",
      },
      {
        title: "Automatic cost recalculation",
        description:
          "Per-unit production cost updates automatically whenever a raw material's price or stock changes.",
      },
      {
        title: "Production forecasting",
        description:
          "See exactly how many units of a finished product you can make right now, based on stock on hand.",
      },
      {
        title: "Shortfall alerts",
        description:
          "Flags which raw materials are short for a planned production run, before it's already underway.",
      },
      {
        title: "Yield & wastage tracking",
        description:
          "Record actual output against planned output per run, so costings reflect real-world yield, not just theory.",
      },
      {
        title: "Shared inventory with Pluto",
        description:
          "No duplicate data entry — Mars reads and writes to the same inventory Pluto already tracks.",
      },
    ],
    faq: [
      {
        question: "Is Mars available now?",
        answer:
          "Not yet. Mars is in early development (pre-release) with no installer built and no confirmed release date — the download button will switch on once that changes.",
      },
      {
        question: "Do I need Pluto to use Mars?",
        answer:
          "Yes. Mars is a companion to Pluto, not a standalone product — it's built to read the same raw-materials inventory Pluto already tracks, so it only makes sense running alongside it.",
      },
      {
        question: "What kind of business is Mars for?",
        answer:
          "Any small manufacturer or processor that turns raw materials into a finished product — bakeries, food and drink processors, or workshops that need to know the real cost of what they make, not just what they sell it for.",
      },
      {
        question: "What will Mars cost?",
        answer:
          "Not decided yet — pricing will be confirmed closer to release.",
      },
    ],
  },
  {
    id: "venus",
    name: "Venus",
    icon: "/images/app-icons/venus.png",
    tagline: "{{VENUS_TAGLINE}}",
    description: "{{VENUS_DESCRIPTION}}",
    version: "1.0.0",
    releaseDate: "24 October 2026",
    platforms: ["windows 10/11"],
    fileSize: "4.5 MB",
    downloadReady: false,
    detailHref: "/downloads/venus",
    screenshots: [
      {
        src: "/images/screenshots/venus-overview.svg",
        alt: "Placeholder screenshot of the Venus overview screen",
        caption: "Overview",
      },
      {
        src: "/images/screenshots/venus-detail.svg",
        alt: "Placeholder screenshot of a Venus detail view",
        caption: "Detail view",
      },
    ],
  },
];
