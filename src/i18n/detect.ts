import { defaultLocale, isLocale, LOCALE_STORAGE_KEY, type Locale } from "./config";

/** Maps a browser language tag ("pt", "pt-PT", "en-GB", "es") to a supported locale. */
export function matchLocale(tag: string): Locale | null {
  const normalized = tag.trim().toLowerCase();
  if (normalized.startsWith("pt")) return "pt-BR";
  if (normalized.startsWith("en")) return "en";
  return null;
}

interface DetectInput {
  saved: string | null;
  languages: readonly string[];
}

/**
 * Initial language: the shopper's saved choice, then the first browser
 * language we support (pt* -> pt-BR, en* -> en), then pt-BR.
 */
export function detectLocale({ saved, languages }: DetectInput): Locale {
  if (isLocale(saved)) return saved;
  for (const language of languages) {
    const match = matchLocale(language);
    if (match) return match;
  }
  // Any other browser language falls back to English, as the most widely understood option.
  return languages.length > 0 ? "en" : defaultLocale;
}

export function readSavedLocale(): string | null {
  try {
    return window.localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Storage may be blocked; the choice still applies through the URL.
  }
}

export function detectBrowserLocale(): Locale {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return detectLocale({ saved: readSavedLocale(), languages: languages.filter(Boolean) });
}
