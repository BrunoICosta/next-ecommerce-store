import type { ProductText } from "../types";

/**
 * English copy for the catalog, keyed by product slug. Slugs, prices and
 * variants are shared; only the marketing text changes per language.
 * Products without an entry fall back to the Portuguese text.
 */
export const productsEn: Record<string, ProductText> = {};
