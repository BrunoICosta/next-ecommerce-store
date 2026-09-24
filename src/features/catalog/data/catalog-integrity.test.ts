import { describe, expect, it } from "vitest";

import { categories } from "./categories";
import { colors } from "./colors";
import { products } from "./products";

describe("catalog data", () => {
  it("has about forty products", () => {
    expect(products.length).toBeGreaterThanOrEqual(36);
  });

  it("uses unique ids and slugs", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });

  it("references only known categories and colors", () => {
    const categorySlugs = new Set(categories.map((c) => c.slug));
    const colorIds = new Set(colors.map((c) => c.id));
    for (const product of products) {
      expect(categorySlugs.has(product.category)).toBe(true);
      product.colors.forEach((color) => expect(colorIds.has(color)).toBe(true));
    }
  });

  it("keeps prices, ratings and variants consistent", () => {
    for (const product of products) {
      expect(Number.isInteger(product.price)).toBe(true);
      expect(product.price).toBeGreaterThan(0);
      if (product.compareAtPrice !== undefined) {
        expect(product.compareAtPrice).toBeGreaterThan(product.price);
      }
      expect(product.rating).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeLessThanOrEqual(5);
      expect(product.colors.length).toBeGreaterThan(0);
      expect(product.sizes.length).toBeGreaterThan(0);
    }
  });
});
