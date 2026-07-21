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
};

export const projects: Project[] = [
  {
    id: "ballylike",
    name: "Ballylike",
    url: "https://ballylike.co.zw",
    category: "{{PROJECT_CATEGORY}}",
    description: "{{PROJECT_DESCRIPTION}}",
    services: ["{{SERVICE_TAG}}"],
    year: "{{PROJECT_YEAR}}",
  },
  {
    id: "kumfence",
    name: "Kumfence",
    url: "https://kumfence.co.zw",
    category: "{{PROJECT_CATEGORY}}",
    description: "{{PROJECT_DESCRIPTION}}",
    services: ["{{SERVICE_TAG}}"],
    year: "{{PROJECT_YEAR}}",
  },
];
