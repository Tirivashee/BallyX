/**
 * ────────────────────────────────────────────────────────────────────────
 * CENTRAL SITE CONFIG
 * ────────────────────────────────────────────────────────────────────────
 * Every brand string, content block, and editable fact on the site lives
 * here. Nothing brand-specific should be hardcoded inside components or
 * pages — if you're typing a word a visitor will read, it belongs in this
 * file (or in the FAQ/data files it imports alongside it).
 *
 * Renaming the company ("BallyX" -> "Ballylike" or anything else)?
 * Change `brand.name` and `brand.shortName` below and every page, the
 * footer, the metadata, and the JSON-LD structured data updates with it.
 *
 * Anything wrapped in {{DOUBLE_BRACES}} in a rendered string is a
 * deliberate placeholder — grep the codebase for "{{" before shipping to
 * find every one of them. See README.md for the full checklist.
 * ────────────────────────────────────────────────────────────────────────
 */

export const brand = {
  name: "BallyX",
  shortName: "BallyX",
  legalName: "BallyX (Pvt) Ltd",
  tagline: "Building software that moves African businesses forward.",
  description:
    "BallyX is a focused software studio in Harare, Zimbabwe. We build custom business software and Pluto, a local-first point-of-sale system built for African SMEs.",
  foundingYear: 2024,
  location: {
    city: "Harare",
    country: "Zimbabwe",
    countryCode: "ZW",
    display: "Harare, Zimbabwe",
  },
  url: "https://www.ballyx.co.zw", // {{SITE_URL}} — update once the domain is live
  email: "hello@ballyx.co.zw", // {{CONTACT_EMAIL}}
  whatsapp: {
    // {{WHATSAPP_NUMBER}} — international format, digits only (no +, spaces, or dashes)
    number: "263771234567",
    display: "+263 77 123 4567",
    defaultMessage:
      "Hi BallyX — I'd like to find out more about Pluto and your services.",
  },
  social: {
    // Leave empty strings for any channel that doesn't exist yet — the UI
    // hides links with no href rather than pointing somewhere broken.
    linkedin: "",
    twitter: "",
    instagram: "",
  },
} as const;

export const nav = [
  { label: "Product", href: "/product" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerLinks = {
  product: [
    { label: "Pluto overview", href: "/product" },
    { label: "Features", href: "/product#features" },
    { label: "Pricing", href: "/product#pricing" },
    { label: "Early access", href: "/product#early-access" },
  ],
  services: [
    { label: "Custom software", href: "/services#custom-software" },
    { label: "Business systems", href: "/services#business-systems" },
    { label: "Web & mobile apps", href: "/services#web-mobile" },
    { label: "Security consulting", href: "/services#security" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Our values", href: "/about#values" },
    { label: "Careers", href: "/about#careers" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

/**
 * Pluto — the flagship product. Status and pricing are explicitly
 * placeholder values; keep the {{...}} markers until real figures exist
 * so nobody mistakes them for confirmed facts.
 */
export const pluto = {
  name: "Pluto",
  category: "Local-first POS & business management",
  status: "{{PLUTO_STATUS}}", // e.g. "Early access" once true
  statusDisplay: "Early access",
  pricing: "{{PLUTO_PRICING}}", // e.g. "From $XX/month" once confirmed
  pricingDisplay: "TBC — founding customers get locked-in early pricing",
  platform: "Desktop app (Windows) — built with Tauri + React",
  tagline: "The register that doesn't stop working when the power does.",
  subhead:
    "Pluto is a point-of-sale and business-management system built for how African SMEs actually operate: patchy power, patchy internet, two currencies, and staff you need to be able to trust with the till.",

  differentiators: [
    {
      id: "offline-first",
      eyebrow: "01 — RELIABILITY",
      title: "Offline-first, not offline-tolerant",
      summary:
        "Pluto runs entirely on the local machine. Sales, inventory, and invoicing keep working through load-shedding and dead connectivity — there's no spinner waiting for a server that isn't there.",
      detail:
        "Everything is written to a local database first. When a connection is available, Pluto can optionally sync an encrypted backup to the cloud — but the shop never stops running because the internet did.",
    },
    {
      id: "dual-currency",
      eyebrow: "02 — CURRENCY",
      title: "USD and ZWG, built in from day one",
      summary:
        "Dual-currency isn't a bolt-on setting. Pricing, change calculation, reporting, and reconciliation are designed around the reality of trading in two currencies at once.",
      detail:
        "Every sale can be taken and reported in USD, ZWG, or both, with exchange-rate handling that matches how Zimbabwean retailers actually price and reconcile stock.",
    },
    {
      id: "audit-trail",
      eyebrow: "03 — TRUST",
      title: "A till record staff can't quietly rewrite",
      summary:
        "Every transaction is written to an append-only, cryptographically hash-chained audit log. If a record is altered after the fact, the chain breaks and it's detectable — not just logged, but tamper-evident.",
      detail:
        "This is built for the most common way small businesses lose money: not armed robbery, but a trusted employee quietly editing or voiding sales over months. Pluto is designed so an owner can trust the numbers without watching the till in person.",
    },
  ],

  features: [
    {
      title: "Inventory management",
      description:
        "Stock levels, low-stock alerts, and product catalogues that stay accurate across every till in the shop.",
    },
    {
      title: "Sales & POS",
      description:
        "A fast checkout flow built for a busy counter — barcode support, quick-add items, and dual-currency totals at the point of sale.",
    },
    {
      title: "Invoicing",
      description:
        "Generate and print professional invoices and receipts for walk-in and account customers alike.",
    },
    {
      title: "Customer credit & ledgers",
      description:
        "Track accounts for customers who buy on credit, with a running ledger so nothing gets lost in a notebook.",
    },
    {
      title: "Reports & dashboard",
      description:
        "Daily, weekly, and monthly views of sales, stock movement, and cash position — the numbers an owner actually checks.",
    },
    {
      title: "Multi-user roles",
      description:
        "Admin, Manager, and Operator roles with permissions that match how a real shop is staffed and supervised.",
    },
  ] as const,

  // Roadmap items are explicitly NOT shipped. Keep this array separate
  // from `features` so the UI can always label these as "Roadmap".
  roadmap: [
    {
      title: "Cloud backup & multi-branch sync",
      description:
        "Optional encrypted backup and syncing inventory and sales across more than one branch.",
    },
    {
      title: "Mobile companion app",
      description:
        "A lightweight mobile view for owners to check sales and stock position away from the counter.",
    },
    {
      title: "Accounting software integrations",
      description: "Direct export/integration with common accounting tools.",
    },
  ] as const,

  faq: [
    {
      question: "Is Pluto available now?",
      answer:
        "Pluto is in {{PLUTO_STATUS}}. We're onboarding a small number of founding customers before a wider release — reach out if you'd like to be one of them.",
    },
    {
      question: "Does Pluto need an internet connection to work?",
      answer:
        "No. Pluto is local-first — it's installed on a computer in your shop and runs fully offline. An internet connection is only used for the optional encrypted cloud backup, never required for day-to-day sales.",
    },
    {
      question: "What happens if the power goes out mid-sale?",
      answer:
        "Because Pluto writes to a local database on your machine rather than a remote server, a power cut doesn't lose your session the way a browser-based or cloud-only POS would. As long as the computer itself has power (e.g. via a small UPS), Pluto keeps running.",
    },
    {
      question: "How does the audit trail actually prevent fraud?",
      answer:
        "Every transaction is recorded in an append-only log where each entry is cryptographically linked to the one before it (a hash chain). Editing or deleting a past entry breaks that chain in a way that's detectable — so instead of trusting that nobody touched the till, an owner can verify it.",
    },
    {
      question: "What does Pluto cost?",
      answer:
        "Pricing is {{PLUTO_PRICING}}. Founding customers who join during early access will get preferential, locked-in pricing as a thank-you for coming in early.",
    },
    {
      question: "What devices does Pluto run on?",
      answer:
        "Pluto is a desktop application for Windows, built with Tauri and React. It's designed to run comfortably on the kind of mid-range PC already found behind most shop counters.",
    },
  ] as const,
} as const;

/**
 * "Who Pluto is built for" — these are illustrative example use-cases,
 * not client names or case studies. Never rename this section or its
 * copy in a way that implies these are real customers.
 */
export const useCases = [
  {
    title: "Hardware stores",
    description:
      "High SKU counts, frequent price changes, and customers who expect a fast, accurate quote at the counter.",
  },
  {
    title: "Pharmacies",
    description:
      "Batch and expiry-sensitive stock, tight margins, and a need for records an owner can fully trust.",
  },
  {
    title: "Bottle stores",
    description:
      "High transaction volume, cash-heavy trade, and real exposure to till-level shrinkage without a tamper-evident record.",
  },
  {
    title: "Spare-parts shops",
    description:
      "Deep, fast-moving catalogues and customers who buy on account — exactly where a real credit ledger earns its keep.",
  },
] as const;

export const whyBallyX = [
  {
    title: "Secure by design",
    description:
      "Security isn't a feature we add later — it shapes how we architect systems from the first line of code.",
  },
  {
    title: "Built for African conditions",
    description:
      "Load-shedding, patchy connectivity, multi-currency trade — we design for the environment our customers actually operate in.",
  },
  {
    title: "Offline-first",
    description:
      "Software that keeps working when the power or the internet doesn't, because that's the normal Tuesday, not the edge case.",
  },
  {
    title: "Human-centered",
    description:
      "Interfaces built for the person at the till at 8am on a busy morning, not for a demo in a boardroom.",
  },
] as const;

export const founderNote = {
  heading: "From the founder",
  // Placeholder personal note — replace with the real founder's voice.
  body: [
    "I started BallyX because I kept seeing the same thing: good businesses across Zimbabwe running on notebooks, memory, and trust — not because owners didn't want better tools, but because the tools built elsewhere were never built for conditions here.",
    "Pluto started as a question: what would a point-of-sale system look like if it were designed from day one for load-shedding, for two currencies, and for an owner who needs to actually trust the numbers their staff give them? Not retrofitted for Zimbabwe — built for it.",
    "We're early. We're small on purpose. And we'd rather build something a handful of businesses genuinely rely on than something that looks impressive and solves nothing real.",
  ],
  name: "{{FOUNDER_NAME}}",
  title: "Founder, BallyX",
} as const;

export const values = [
  {
    title: "Innovation",
    description:
      "We solve real, local problems with sound engineering — not novelty for its own sake.",
  },
  {
    title: "Security",
    description:
      "Trust is a feature. We build with an assurance mindset, not as an afterthought.",
  },
  {
    title: "Simplicity",
    description:
      "The best business tool is the one your staff can use correctly on their first day.",
  },
  {
    title: "Reliability",
    description:
      "Software that works the same way on a good day and a bad one — that's the whole job.",
  },
  {
    title: "Growth",
    description:
      "We build for where our customers' businesses are going, not just where they are today.",
  },
] as const;

export const timeline = [
  {
    year: "2024",
    title: "BallyX founded",
    description: "Started in Harare with a focus on custom business software.",
  },
  {
    year: "2025",
    title: "Pluto development begins",
    description:
      "Work starts on a local-first POS system shaped by direct conversations with SME owners.",
  },
  {
    year: "{{CURRENT_YEAR}}",
    title: "Early access",
    description:
      "Pluto opens to a small group of founding customers ahead of a wider release.",
  },
] as const;

// Founder-led team. Placeholder entries — replace with real people/photos.
export const team = [
  {
    name: "{{FOUNDER_NAME}}",
    role: "Founder & Engineering Lead",
    bio: "{{FOUNDER_BIO}}",
  },
] as const;

export const contact = {
  heading: "Let's talk about what you need built.",
  subhead:
    "Whether it's Pluto for your shop or a custom system for your business, the fastest way to reach us is WhatsApp.",
} as const;
