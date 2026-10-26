import type { Locale } from "../config";
import { en } from "./en";
import { ptBR, type Dictionary } from "./pt-BR";

const dictionaries: Record<Locale, Dictionary> = { "pt-BR": ptBR, en };

/**
 * Dictionaries are plain typed modules, so Server Components read them at
 * build time and Client Components receive the same object through context.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
