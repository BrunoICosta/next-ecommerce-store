import { describe, expect, it } from "vitest";

import { categorySlugs } from "./categories";
import { colorIds } from "./colors";
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
    const knownCategories = new Set(categorySlugs);
    const knownColors = new Set(colorIds);
    for (const product of products) {
      expect(knownCategories.has(product.category)).toBe(true);
      product.colors.forEach((color) => expect(knownColors.has(color)).toBe(true));
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
