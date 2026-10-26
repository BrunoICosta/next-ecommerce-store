import { notFound } from "next/navigation";

import { createRoutes } from "@/lib/routes";

import { isLocale, locales, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

/** generateStaticParams helper for the `[locale]` segment. */
export function localeParams(): { locale: Locale }[] {
  return locales.map((locale) => ({ locale }));
}

/** Resolves the `[locale]` param in Server Components (404 for unknown values). */
export async function resolveLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, t: getDictionary(locale), routes: createRoutes(locale) };
}
