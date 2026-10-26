"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import { createRoutes, type Routes } from "@/lib/routes";

import type { Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

interface I18nContextValue {
  locale: Locale;
  t: Dictionary;
  routes: Routes;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Only the locale crosses the server/client boundary; the dictionary is
 * resolved here, so function entries (plurals, interpolation) keep working.
 */
export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo(
    () => ({ locale, t: getDictionary(locale), routes: createRoutes(locale) }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside <I18nProvider>");
  return context;
}
