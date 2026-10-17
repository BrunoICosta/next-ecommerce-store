import { describe, expect, it } from "vitest";

import { products } from "./data/products";
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  filterProducts,
  normalizeText,
  toggleValue,
  type CatalogFilters,
} from "./filters";

const withFilters = (patch: Partial<CatalogFilters>) =>
  filterProducts(products, { ...DEFAULT_FILTERS, ...patch });

describe("normalizeText", () => {
  it("lowercases and removes accents", () => {
    expect(normalizeText("  Tênis CALÇA  ")).toBe("tenis calca");
  });
});

describe("filterProducts", () => {
  it("returns every product with default filters", () => {
    expect(withFilters({})).toHaveLength(products.length);
  });

  it("filters by category", () => {
    const result = withFilters({ categories: ["tenis", "bones"] });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category === "tenis" || p.category === "bones")).toBe(true);
  });

  it("filters by color and size (any match)", () => {
    const result = withFilters({ colors: ["vinho"], sizes: ["GG"] });
    expect(result.length).toBeGreaterThan(0);
    for (const product of result) {
      expect(product.colors).toContain("vinho");
      expect(product.sizes).toContain("GG");
    }
  });

  it("filters by inclusive price range in reais", () => {
    const result = withFilters({ minPrice: 100, maxPrice: 200 });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.price >= 10_000 && p.price <= 20_000)).toBe(true);
  });

  it("filters by minimum rating and sale items", () => {
    const result = withFilters({ minRating: 4.6, onSale: true });
    expect(result.length).toBeGreaterThan(0);
    for (const product of result) {
      expect(product.rating).toBeGreaterThanOrEqual(4.6);
      expect(product.compareAtPrice).toBeGreaterThan(product.price);
    }
  });

  it("searches ignoring accents and requires every term", () => {
    const result = withFilters({ query: "tenis couro" });
    expect(result.map((p) => p.name)).toEqual(["Tênis Casual Couro"]);
  });

  it("matches color names and features in the search", () => {
    expect(withFilters({ query: "merino" }).map((p) => p.name)).toContain("Gorro Tricot");
  });

  it("sorts by price ascending and descending", () => {
    const asc = withFilters({ sort: "menor-preco" }).map((p) => p.price);
    const desc = withFilters({ sort: "maior-preco" }).map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    expect(desc).toEqual([...asc].reverse());
  });

  it("ranks name matches first when sorting by relevance", () => {
    const [first] = withFilters({ query: "mochila" });
    expect(first.name.toLowerCase()).toContain("mochila");
  });

  it("returns an empty list when nothing matches", () => {
    expect(withFilters({ query: "guarda-chuva" })).toEqual([]);
  });
});

describe("countActiveFilters", () => {
  it("counts each selected value and grouped ranges once", () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0);
    expect(
      countActiveFilters({
        ...DEFAULT_FILTERS,
        categories: ["tenis"],
        colors: ["preto", "branco"],
        minPrice: 10,
        maxPrice: 50,
        onSale: true,
      }),
    ).toBe(5);
  });
});

describe("toggleValue", () => {
  it("adds missing values and removes existing ones", () => {
    expect(toggleValue(["a"], "b")).toEqual(["a", "b"]);
    expect(toggleValue(["a", "b"], "a")).toEqual(["b"]);
  });
});
