import { isCategorySlug } from "./data/categories";
import { isColorId } from "./data/colors";
import {
  DEFAULT_FILTERS,
  SIZE_ORDER,
  SORT_OPTIONS,
  type CatalogFilters,
  type SortOption,
} from "./filters";
import type { Size } from "./types";

/**
 * Filters live in the URL so results are shareable, survive a refresh and
 * work with the browser back button. Keys are in Portuguese to match the UI:
 * /produtos/?categoria=tenis,camisetas&cor=preto&preco_max=300&ordem=menor-preco
 */
export const FILTER_PARAMS = {
  query: "q",
  categories: "categoria",
  colors: "cor",
  sizes: "tamanho",
  minPrice: "preco_min",
  maxPrice: "preco_max",
  minRating: "avaliacao",
  onSale: "ofertas",
  sort: "ordem",
} as const;

interface ReadableParams {
  get(name: string): string | null;
}

function parseList<T extends string>(
  raw: string | null,
  guard: (value: string) => value is T,
): T[] {
  if (!raw) return [];
  const values = raw
    .split(",")
    .map((value) => value.trim())
    .filter(guard);
  return [...new Set(values)];
}

function parseNumber(raw: string | null, { min = 0, max = Infinity } = {}): number | null {
  if (raw === null || raw.trim() === "") return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) return null;
  return value;
}

const isSize = (value: string): value is Size => SIZE_ORDER.includes(value as Size);
const isSort = (value: string): value is SortOption =>
  (SORT_OPTIONS as readonly string[]).includes(value);

export function parseFilters(params: ReadableParams): CatalogFilters {
  const sort = params.get(FILTER_PARAMS.sort) ?? "";
  let minPrice = parseNumber(params.get(FILTER_PARAMS.minPrice));
  let maxPrice = parseNumber(params.get(FILTER_PARAMS.maxPrice));
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  return {
    query: (params.get(FILTER_PARAMS.query) ?? "").trim().slice(0, 80),
    categories: parseList(params.get(FILTER_PARAMS.categories), isCategorySlug),
    colors: parseList(params.get(FILTER_PARAMS.colors), isColorId),
    sizes: parseList(params.get(FILTER_PARAMS.sizes), isSize),
    minPrice,
    maxPrice,
    minRating: parseNumber(params.get(FILTER_PARAMS.minRating), { min: 0, max: 5 }),
    onSale: params.get(FILTER_PARAMS.onSale) === "1",
    sort: isSort(sort) ? sort : DEFAULT_FILTERS.sort,
  };
}

/** Serializes only non-default values to keep URLs short and readable. */
export function serializeFilters(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set(FILTER_PARAMS.query, filters.query.trim());
  if (filters.categories.length) params.set(FILTER_PARAMS.categories, filters.categories.join(","));
  if (filters.colors.length) params.set(FILTER_PARAMS.colors, filters.colors.join(","));
  if (filters.sizes.length) params.set(FILTER_PARAMS.sizes, filters.sizes.join(","));
  if (filters.minPrice !== null) params.set(FILTER_PARAMS.minPrice, String(filters.minPrice));
  if (filters.maxPrice !== null) params.set(FILTER_PARAMS.maxPrice, String(filters.maxPrice));
  if (filters.minRating !== null) params.set(FILTER_PARAMS.minRating, String(filters.minRating));
  if (filters.onSale) params.set(FILTER_PARAMS.onSale, "1");
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set(FILTER_PARAMS.sort, filters.sort);
  return params;
}
