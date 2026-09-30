import { getCategory } from "./data/categories";
import { getColor } from "./data/colors";
import type { CategorySlug, ColorId, Product, Size } from "./types";

export const SORT_OPTIONS = [
  { value: "relevancia", label: "Relevância" },
  { value: "mais-vendidos", label: "Mais vendidos" },
  { value: "novidades", label: "Novidades" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "avaliacao", label: "Melhor avaliados" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const SIZE_ORDER: Size[] = [
  "PP",
  "P",
  "M",
  "G",
  "GG",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "U",
];

export const RATING_OPTIONS = [4.5, 4, 3.5] as const;

export interface CatalogFilters {
  query: string;
  categories: CategorySlug[];
  colors: ColorId[];
  sizes: Size[];
  /** Price bounds in whole reais (as typed by the shopper), inclusive. */
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  onSale: boolean;
  sort: SortOption;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  query: "",
  categories: [],
  colors: [],
  sizes: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  onSale: false,
  sort: "relevancia",
};

/** Lowercases and strips accents so "tenis" matches "Tênis". */
export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function searchableText(product: Product): string {
  return normalizeText(
    [
      product.name,
      product.tagline,
      getCategory(product.category).name,
      ...product.colors.map((color) => getColor(color).name),
      ...product.features,
    ].join(" "),
  );
}

const searchIndex = new WeakMap<Product, string>();

function getSearchText(product: Product): string {
  let text = searchIndex.get(product);
  if (text === undefined) {
    text = searchableText(product);
    searchIndex.set(product, text);
  }
  return text;
}

function matchesQuery(product: Product, terms: string[]): boolean {
  if (terms.length === 0) return true;
  const text = getSearchText(product);
  return terms.every((term) => text.includes(term));
}

function relevanceScore(product: Product, terms: string[]): number {
  const name = normalizeText(product.name);
  const nameHits = terms.filter((term) => name.includes(term)).length;
  // Name matches dominate; popularity breaks ties.
  return nameHits * 100_000 + product.soldCount * product.rating;
}

function compareBy(sort: SortOption, terms: string[]) {
  return (a: Product, b: Product): number => {
    switch (sort) {
      case "mais-vendidos":
        return b.soldCount - a.soldCount;
      case "novidades":
        return b.createdAt.localeCompare(a.createdAt);
      case "menor-preco":
        return a.price - b.price;
      case "maior-preco":
        return b.price - a.price;
      case "avaliacao":
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case "relevancia":
      default:
        return relevanceScore(b, terms) - relevanceScore(a, terms);
    }
  };
}

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const terms = normalizeText(filters.query).split(/\s+/).filter(Boolean);
  const minCents = filters.minPrice !== null ? filters.minPrice * 100 : null;
  const maxCents = filters.maxPrice !== null ? filters.maxPrice * 100 : null;

  return products
    .filter((product) => {
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      if (filters.colors.length > 0 && !product.colors.some((c) => filters.colors.includes(c))) {
        return false;
      }
      if (filters.sizes.length > 0 && !product.sizes.some((s) => filters.sizes.includes(s))) {
        return false;
      }
      if (minCents !== null && product.price < minCents) return false;
      if (maxCents !== null && product.price > maxCents) return false;
      if (filters.minRating !== null && product.rating < filters.minRating) return false;
      if (filters.onSale && !(product.compareAtPrice && product.compareAtPrice > product.price)) {
        return false;
      }
      return matchesQuery(product, terms);
    })
    .sort(compareBy(filters.sort, terms));
}

export function countActiveFilters(filters: CatalogFilters): number {
  return (
    filters.categories.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0) +
    (filters.onSale ? 1 : 0)
  );
}

export function toggleValue<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}
