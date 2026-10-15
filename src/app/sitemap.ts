import type { MetadataRoute } from "next";

import { getAllProducts } from "@/features/catalog";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Generated at build time into out/sitemap.xml. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-15");
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl(routes.home), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl(routes.products()), lastModified, changeFrequency: "daily", priority: 0.9 },
  ];

  const productPages: MetadataRoute.Sitemap = getAllProducts().map((product) => ({
    url: absoluteUrl(routes.product(product.slug)),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
