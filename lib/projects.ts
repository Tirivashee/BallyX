/**
 * Client projects showcased on the /projects page. Real companies BallyX
 * has built for — keep entries limited to work that actually shipped.
 *
 * Anything wrapped in {{DOUBLE_BRACES}} is a deliberate placeholder — see
 * README.md for the site-wide {{...}} checklist before shipping.
 */
export type Project = {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  services: string[];
  year: string;
  image: string;
};

export const projects: Project[] = [
  {
    id: "ballylike",
    name: "Ballylike",
    url: "https://ballylike.co.zw",
    category: "E-commerce · Fashion & Apparel",
    description:
      "Online store for a Harare faith-and-streetwear label — full shop with cart, wishlist, and a gallery built around its Faith × Culture × Design collections.",
    services: ["Web & mobile apps"],
    year: "2025",
    image: "/images/screenshots/ballylike.png",
  },
  {
    id: "kumfence",
    name: "Kumfence",
    url: "https://kumfence.co.zw",
    category: "Business Website · Fencing & Security",
    description:
      "Lead-generation site for a Harare fencing and security manufacturer — service and project galleries with WhatsApp and quote-request CTAs to turn visitors into customers.",
    services: ["Web & mobile apps"],
    year: "2021",
    image: "/images/screenshots/kumfence.png",
  },
];
