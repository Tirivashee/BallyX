import type { MetadataRoute } from "next";

import { brand } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/product",
    "/services",
    "/hosting",
    "/downloads",
    "/downloads/mars",
    "/downloads/venus",
    "/projects",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${brand.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/product" ? 0.9 : 0.6,
  }));
}
