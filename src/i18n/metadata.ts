import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/site";

import { locales, type Locale } from "./config";

/**
 * Canonical + hreflang alternates for a path that exists in every locale.
 * `path` is locale-less and starts with "/", e.g. "/produtos/".
 */
export function localizedAlternates(locale: Locale, path = "/"): Metadata["alternates"] {
  return {
    canonical: absoluteUrl(`/${locale}${path}`),
    languages: {
      ...Object.fromEntries(locales.map((code) => [code, absoluteUrl(`/${code}${path}`)])),
      "x-default": absoluteUrl(path === "/" ? "/" : `/pt-BR${path}`),
    },
  };
}
