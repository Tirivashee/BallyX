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
  /**
   * "desktop" apps (Pluto, Mars) ship an installer — the card/hero show a
   * file size and a "Download for {platform}" button. "cloud" apps (Venus)
   * are browser-based SaaS — there's no file to download, so the card shows
   * `access` instead of `fileSize` and the CTA reads "Coming soon" without
   * implying a file transfer. Defaults to "desktop" when omitted.
   */
  deliveryType?: "desktop" | "cloud";
  fileSize?: string;
  /** Cloud-only: shown in place of `fileSize`, e.g. "Web browser — no install". */
  access?: string;
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
    tagline:
      "Cloud payroll for Zimbabwean SMEs, and the bookkeepers who run it for them.",
    description:
      "Venus computes gross-to-net payroll for salaries split across USD and ZWG, then generates payslips and the ZIMRA/NSSA statutory remittance paperwork that comes with running payroll in Zimbabwe.",
    version: "0.1.0", // pre-release — not yet built/packaged
    releaseDate: "TBC", // no confirmed launch date yet
    platforms: ["Web browser"],
    deliveryType: "cloud",
    access: "Cloud — sign in from any browser, nothing to install",
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
    differentiators: [
      {
        id: "verified-compliance",
        eyebrow: "01 — COMPLIANCE",
        title: "Tax rules that admit what they don't know yet",
        summary:
          "PAYE tax bands, NSSA rates, and the AIDS levy are versioned by effective date and start life UNVERIFIED — flagged with an amber banner, a stricter finalize-confirmation step, and watermarked PDFs until an Owner or Payroll Admin marks the rule VERIFIED against a cited source.",
        detail:
          "Payroll software that silently trusts a tax table is how businesses end up under- or over-remitting to ZIMRA and NSSA. Venus makes the confidence level of every statutory rule visible instead of assuming it's correct by default.",
      },
      {
        id: "dual-currency-payroll",
        eyebrow: "02 — CURRENCY",
        title: "USD and ZWG payroll, computed correctly from day one",
        summary:
          "Gross-to-net computation handles salaries split across USD and ZWG the way Zimbabwean employers actually pay them, not bolted on as an afterthought.",
        detail:
          "Payslips and statutory paperwork reflect exactly how a salary is split between the two currencies. Venus doesn't attempt automatic FX conversion between them in v1 — currencies are computed and reported as entered.",
      },
      {
        id: "immutable-pay-runs",
        eyebrow: "03 — TRUST",
        title: "A finalized pay run that can't quietly be edited",
        summary:
          "Once a pay run is finalized, it's locked — enforced by database triggers, not just an app-level rule a bug or workaround could bypass.",
        detail:
          "Payroll history is a compliance record, not a draft. Finalizing a run closes it permanently at the database level, so what was paid and remitted stays exactly as it was reported.",
      },
    ],
    features: [
      {
        title: "Gross-to-net payroll",
        description:
          "Full computation for salaries split between USD and ZWG, ready to feed straight into payslips.",
      },
      {
        title: "Payslip generation",
        description:
          "Clean, printable PDF payslips for every employee in a pay run, built with @react-pdf/renderer.",
      },
      {
        title: "ZIMRA & NSSA remittance paperwork",
        description:
          "Generates the statutory documents needed to remit PAYE, NSSA, and the AIDS levy, in the format authorities expect.",
      },
      {
        title: "Versioned, verifiable compliance rules",
        description:
          "PAYE bands, NSSA rates, and the AIDS levy are tracked by effective date and require a named Owner or Payroll Admin to mark them VERIFIED before they're trusted.",
      },
      {
        title: "Organizations, companies & employees",
        description:
          "A domain model built for bookkeepers running payroll across multiple client companies from one place.",
      },
      {
        title: "Audit log",
        description:
          "Every pay run and rule change is recorded, so there's a clear record of who did what and when.",
      },
    ],
    faq: [
      {
        question: "Is Venus available now?",
        answer:
          "Not yet. Venus is in early development with no confirmed launch date — the sign-up button will switch on once that changes.",
      },
      {
        question: "Does Venus handle leave, timesheets, or pro-rata pay?",
        answer:
          "Not in v1. Venus's first version is focused on gross-to-net computation, payslips, and statutory paperwork — leave/timesheets, pro-rata pay, and employee self-service are explicitly out of scope for now.",
      },
      {
        question: "Can employees view their own payslips in Venus?",
        answer:
          "Not in v1 — there's no employee self-service portal yet, and payslip delivery by email or WhatsApp isn't built in. Payslips are generated for the payroll admin to distribute.",
      },
      {
        question: "What happens once a pay run is finalized?",
        answer:
          "It's locked. Finalized pay runs are immutable — enforced by database triggers, not just app-level rules — so a completed run can't be quietly edited afterward.",
      },
      {
        question: "Does Venus convert between USD and ZWG automatically?",
        answer:
          "No. Multi-currency FX conversion is explicitly out of scope for v1 — salaries are computed and reported in the currency split they're entered in.",
      },
      {
        question: "Is Venus related to Pluto?",
        answer:
          "They're sibling products in the BallyX suite and share the same design lineage, but they're unrelated tools — Pluto is a point-of-sale system, Venus is a payroll platform. There's no shared data between them.",
      },
    ],
  },
];
