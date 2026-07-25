/**
 * Services offered by the studio, separate from `site-config.ts` because
 * this list should stay short and honest by construction. Every entry
 * here must be something the team can actually deliver today.
 *
 * If you're tempted to add a service the team can't yet staff or
 * deliver on, don't — add it to Pluto's roadmap instead, or wait until
 * it's real. This list is deliberately short.
 */
export type Service = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  capabilities: string[];
  href?: string;
};

export const services: Service[] = [
  {
    id: "custom-software",
    title: "Custom software",
    eyebrow: "01",
    description:
      "Bespoke systems built around how your business actually runs, not how off-the-shelf software assumes it should.",
    capabilities: [
      "Requirements & process discovery",
      "Bespoke application design and build",
      "Ongoing maintenance and support",
    ],
  },
  {
    id: "business-systems",
    title: "Business systems",
    eyebrow: "02",
    description:
      "Internal tools for inventory, sales, invoicing, and reporting — the operational backbone most SMEs are missing.",
    capabilities: [
      "Inventory & stock management tools",
      "Sales, invoicing & ledger systems",
      "Reporting dashboards for owners and managers",
    ],
  },
  {
    id: "web-mobile",
    title: "Web & mobile apps",
    eyebrow: "03",
    description:
      "Customer-facing and internal apps built with modern, maintainable web and mobile technology.",
    capabilities: [
      "Marketing & product websites",
      "Web applications",
      "Cross-platform mobile apps",
    ],
  },
  {
    id: "security",
    title: "Secure development & security consulting",
    eyebrow: "04",
    description:
      "Given the founder's security and assurance background, we build with a security-first mindset and can review systems you already have.",
    capabilities: [
      "Secure-by-design application architecture",
      "Application security reviews",
      "Guidance on data handling & access control",
    ],
  },
];
