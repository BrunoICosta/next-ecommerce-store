export const locales = ["pt-BR", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt-BR";

export const LOCALE_STORAGE_KEY = "trama-locale";

/** BCP 47 tag used by Intl (numbers, currency, dates). */
export const intlLocale: Record<Locale, string> = {
  "pt-BR": "pt-BR",
  en: "en-US",
};

/** Open Graph locale format. */
export const ogLocale: Record<Locale, string> = {
  "pt-BR": "pt_BR",
  en: "en_US",
};

/** Language names shown in the switcher, always in their own language. */
export const localeNames: Record<Locale, string> = {
  "pt-BR": "Português (Brasil)",
  en: "English",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
