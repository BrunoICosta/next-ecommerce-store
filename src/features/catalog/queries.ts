import { products } from "./data/products";
import type { CategorySlug, Product } from "./types";

const productBySlug = new Map(products.map((product) => [product.slug, product]));
const productById = new Map(products.map((product) => [product.id, product]));

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return productBySlug.get(slug);
}

export function getProductById(id: string): Product | undefined {
  return productById.get(id);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return products.filter((product) => product.category === category);
}

export function getBestSellers(limit = 8): Product[] {
  return [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, limit);
}

export function getNewArrivals(limit = 4): Product[] {
  return [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
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
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const others = products.filter((candidate) => candidate.id !== product.id);
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
  return products.reduce(
    (counts, product) => {
      counts[product.category] += 1;
      return counts;
    },
    { camisetas: 0, moletons: 0, calcas: 0, tenis: 0, bones: 0, mochilas: 0 },
  );
}
