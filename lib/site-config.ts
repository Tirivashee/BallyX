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
  { label: "Downloads", href: "/downloads" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerLinks = {
  product: [
    { label: "Pluto overview", href: "/product" },
    { label: "Features", href: "/product#features" },
    { label: "Pricing", href: "/product#pricing" },
    { label: "Early access", href: "/product#early-access" },
    { label: "Downloads", href: "/downloads" },
  ],
  services: [
    { label: "Custom software", href: "/services#custom-software" },
    { label: "Business systems", href: "/services#business-systems" },
    { label: "Web & mobile apps", href: "/services#web-mobile" },
    { label: "Security consulting", href: "/services#security" },
    { label: "BallyX Hosting", href: "/hosting" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
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
 * BallyX Hosting — a managed-hosting service for sites/systems we build.
 * Status and pricing are explicitly placeholder, same convention as
 * `pluto` above: keep the {{...}} markers until real figures exist.
 */
export const hosting = {
  name: "BallyX Hosting",
  tagline: "Managed hosting for the software we build you.",
  subhead:
    "Deployments, SSL, custom domains, backups, and uptime monitoring — handled by the same team that built your site or system, so nothing falls in a gap between developer and host.",
  status: "{{HOSTING_STATUS}}", // e.g. "Now onboarding" once true
  statusDisplay: "Now onboarding",
  pricing: "{{HOSTING_PRICING}}",
  pricingDisplay: "TBC — plans sized to what you actually need hosted",

  features: [
    {
      title: "Managed deployments",
      description:
        "We handle releases and updates for sites and systems we build — no server maintenance for you to manage.",
    },
    {
      title: "Free SSL & custom domains",
      description:
        "Every site gets a valid SSL certificate and support for connecting your own domain, included by default.",
    },
    {
      title: "Uptime monitoring",
      description:
        "Automated checks watch for downtime so issues get caught and fixed before a customer notices.",
    },
    {
      title: "Automatic backups",
      description:
        "Regular backups of your site or system's data, so a bad deploy or outage is never a total loss.",
    },
    {
      title: "Direct support",
      description:
        "Hosting issues go straight to the team that built the system — no third-party support queue.",
    },
    {
      title: "Client dashboard",
      description:
        "A dashboard to see your site's status, domains, and deployment history at a glance. Currently in preview.",
    },
  ] as const,

  /**
   * Indicative plan tiers. Prices are explicitly placeholder — see the
   * {{...}} convention note above. Feature lists are honest today: don't
   * add a checkmark for something the team can't yet deliver.
   */
  plans: [
    {
      id: "starter",
      name: "Starter",
      price: "{{HOSTING_PRICE_STARTER}}",
      tagline: "A single marketing site or small web app.",
      features: [
        "1 site",
        "Free SSL & custom domain",
        "Automatic backups (weekly)",
        "Uptime monitoring",
        "Email support",
      ],
      highlighted: false,
    },
    {
      id: "standard",
      name: "Standard",
      price: "{{HOSTING_PRICE_STANDARD}}",
      tagline: "A business system or app your team relies on daily.",
      features: [
        "Up to 3 sites",
        "Free SSL & custom domains",
        "Automatic backups (daily)",
        "Uptime monitoring & alerts",
        "Priority support",
        "Staging environment",
      ],
      highlighted: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "{{HOSTING_PRICE_PRO}}",
      tagline: "Multiple systems, or one that can't afford downtime.",
      features: [
        "Unlimited sites",
        "Free SSL & custom domains",
        "Automatic backups (daily + on-demand)",
        "24/7 uptime monitoring & alerts",
        "Priority support with direct line",
        "Staging environment",
        "Quarterly security review",
      ],
      highlighted: false,
    },
  ] as const,

  /** "How it works" onboarding steps shown on the marketing page. */
  steps: [
    {
      title: "Tell us what needs hosting",
      description:
        "A marketing site, a web app, or a system we've already built you — reach out and we'll scope a plan around it.",
    },
    {
      title: "We deploy & connect your domain",
      description:
        "We set up hosting, SSL, and your domain (new or existing) so everything resolves correctly from day one.",
    },
    {
      title: "We monitor & back it up",
      description:
        "Uptime monitoring and automatic backups run in the background, so issues get caught before they become outages.",
    },
    {
      title: "You get dashboard access",
      description:
        "See site status, domains, and deployment history in one place. The dashboard is currently in preview.",
    },
  ] as const,

  /** Trust/guarantee points. Numbers are placeholders until policy is set. */
  guarantees: [
    {
      title: "{{HOSTING_UPTIME_SLA}} uptime target",
      description:
        "Automated monitoring watches every hosted site around the clock.",
    },
    {
      title: "Free migration",
      description:
        "Moving an existing site to BallyX Hosting doesn't cost extra.",
    },
    {
      title: "Daily backups",
      description:
        "Automatic backups mean a bad deploy or outage is never a total loss.",
    },
    {
      title: "{{HOSTING_MONEY_BACK_POLICY}}",
      description:
        "Full terms confirmed once hosting moves out of early access.",
    },
  ] as const,

  /**
   * Indicative TLD pricing shown next to the domain-interest form. Every
   * price is a placeholder — replace with real figures before launch,
   * and don't imply this is a live registrar lookup (it isn't).
   */
  domainPricing: [
    { tld: ".com", price: "{{DOMAIN_PRICE_COM}}" },
    { tld: ".co.zw", price: "{{DOMAIN_PRICE_COZW}}" },
    { tld: ".africa", price: "{{DOMAIN_PRICE_AFRICA}}" },
    { tld: ".online", price: "{{DOMAIN_PRICE_ONLINE}}" },
  ] as const,

  faq: [
    {
      question: "Is BallyX Hosting available now?",
      answer:
        "Hosting is {{HOSTING_STATUS}} for clients we build software for. Reach out if you'd like your site or system hosted with us.",
    },
    {
      question: "Can I host a site that BallyX didn't build?",
      answer:
        "Right now hosting is offered alongside custom software we build for you. Ask us — this may become a standalone offering later.",
    },
    {
      question: "What does the client dashboard show?",
      answer:
        "The dashboard is currently a front-end preview of what's planned — site status, domains & SSL, and deployment history. It isn't yet wired up to real infrastructure data.",
    },
    {
      question: "What does hosting cost?",
      answer:
        "Pricing is {{HOSTING_PRICING}} — plans will be sized to what's actually being hosted rather than a one-size-fits-all fee.",
    },
    {
      question: "Can I transfer a domain I already own?",
      answer:
        "Yes — tell us the domain and current registrar, and we'll walk you through transferring it or simply pointing its DNS at BallyX Hosting, whichever makes more sense.",
    },
    {
      question: "Can I make my own DNS changes?",
      answer:
        "Once your dashboard access is live, yes. Until then, send us the change and we'll make it directly.",
    },
    {
      question: "What happens if I need to move away from BallyX Hosting?",
      answer:
        "Your domain and data are yours. We'll help export what's needed and point DNS wherever you move to — no lock-in.",
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
  name: "T O. Chitanda",
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
    year: "2026",
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
