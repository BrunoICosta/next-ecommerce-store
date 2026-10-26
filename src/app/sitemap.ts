import type { MetadataRoute } from "next";

import { getAllProducts } from "@/features/catalog";
import { locales, type Locale } from "@/i18n/config";
import { createRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const lastModified = new Date("2026-10-28");

/** Same page in every language, each entry listing its hreflang alternates. */
function localizedEntry(
  path: (locale: Locale) => string,
  changeFrequency: "daily" | "weekly",
  priority: number,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((code) => [code, absoluteUrl(path(code))]));
  return locales.map((locale) => ({
    url: absoluteUrl(path(locale)),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

/** Generated at build time into out/sitemap.xml, covering pt-BR and en. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...localizedEntry((locale) => createRoutes(locale).home, "weekly", 1),
    ...localizedEntry((locale) => createRoutes(locale).products(), "daily", 0.9),
    ...getAllProducts("pt-BR").flatMap((product) =>
      localizedEntry((locale) => createRoutes(locale).product(product.slug), "weekly", 0.8),
    ),
  ];
}
