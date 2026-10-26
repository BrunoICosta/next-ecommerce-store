import type { Locale } from "@/i18n/config";

import { products as baseProducts } from "./data/products";
import { productsEn } from "./data/products.en";
import type { CategorySlug, Product } from "./types";

/**
 * Catalog text lives in Portuguese in `data/products.ts` and in English in
 * `data/products.en.ts`. Localized lists are built once per locale and reused,
 * so object identity is stable (handy for memoization and the search index).
 */
const catalogByLocale = new Map<Locale, Product[]>();

function localize(product: Product, locale: Locale): Product {
  if (locale === "pt-BR") return product;
  const text = productsEn[product.slug];
  return text ? { ...product, ...text } : product;
}

export function getAllProducts(locale: Locale): Product[] {
  let list = catalogByLocale.get(locale);
  if (!list) {
    list = baseProducts.map((product) => localize(product, locale));
    catalogByLocale.set(locale, list);
  }
  return list;
}

export function getProductBySlug(slug: string, locale: Locale): Product | undefined {
  return getAllProducts(locale).find((product) => product.slug === slug);
}

export function getProductById(id: string, locale: Locale): Product | undefined {
  return getAllProducts(locale).find((product) => product.id === id);
}

/** Price lookup that does not depend on the language. */
export function getProductPrice(id: string): number | undefined {
  return baseProducts.find((product) => product.id === id)?.price;
}

export function getProductsByCategory(category: CategorySlug, locale: Locale): Product[] {
  return getAllProducts(locale).filter((product) => product.category === category);
}

export function getBestSellers(locale: Locale, limit = 8): Product[] {
  return [...getAllProducts(locale)].sort((a, b) => b.soldCount - a.soldCount).slice(0, limit);
}

export function getNewArrivals(locale: Locale, limit = 4): Product[] {
  return [...getAllProducts(locale)]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function isOnSale(product: Product): boolean {
  return product.compareAtPrice !== undefined && product.compareAtPrice > product.price;
}

export function getDiscountPercent(product: Product): number {
  if (!isOnSale(product) || product.compareAtPrice === undefined) return 0;
  return Math.round((1 - product.price / product.compareAtPrice) * 100);
}

/**
 * Related products: same category first (closest price wins), then fills the
 * remaining slots with products that share at least one color.
 */
export function getRelatedProducts(product: Product, locale: Locale, limit = 4): Product[] {
  const others = getAllProducts(locale).filter((candidate) => candidate.id !== product.id);
  const sameCategory = others
    .filter((candidate) => candidate.category === product.category)
    .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price));
  const sharesColor = others.filter(
    (candidate) =>
      candidate.category !== product.category &&
      candidate.colors.some((color) => product.colors.includes(color)),
  );
  return [...sameCategory, ...sharesColor].slice(0, limit);
}

export function getCategoryCounts(): Record<CategorySlug, number> {
  return baseProducts.reduce(
    (counts, product) => {
      counts[product.category] += 1;
      return counts;
    },
    { camisetas: 0, moletons: 0, calcas: 0, tenis: 0, bones: 0, mochilas: 0 },
  );
}
