import { describe, expect, it } from "vitest";

import { DEFAULT_FILTERS } from "./filters";
import { parseFilters, serializeFilters } from "./filters-url";

describe("parseFilters", () => {
  it("returns defaults for an empty query string", () => {
    expect(parseFilters(new URLSearchParams())).toEqual(DEFAULT_FILTERS);
  });

  it("parses every supported parameter", () => {
    const filters = parseFilters(
      new URLSearchParams(
        "q=moletom&categoria=moletons,tenis&cor=preto&tamanho=M,42&preco_min=50&preco_max=300&avaliacao=4.5&ofertas=1&ordem=menor-preco",
      ),
    );
    expect(filters).toEqual({
      query: "moletom",
      categories: ["moletons", "tenis"],
      colors: ["preto"],
      sizes: ["M", "42"],
      minPrice: 50,
      maxPrice: 300,
      minRating: 4.5,
      onSale: true,
      sort: "menor-preco",
    });
  });

  it("ignores unknown values instead of failing", () => {
    const filters = parseFilters(
      new URLSearchParams(
        "categoria=carros,tenis&cor=roxo&tamanho=XXL&avaliacao=9&ordem=aleatorio",
      ),
    );
    expect(filters.categories).toEqual(["tenis"]);
    expect(filters.colors).toEqual([]);
    expect(filters.sizes).toEqual([]);
    expect(filters.minRating).toBeNull();
    expect(filters.sort).toBe("relevancia");
  });

  it("swaps an inverted price range and removes duplicates", () => {
    const filters = parseFilters(
      new URLSearchParams("preco_min=400&preco_max=100&cor=preto,preto"),
    );
    expect(filters.minPrice).toBe(100);
    expect(filters.maxPrice).toBe(400);
    expect(filters.colors).toEqual(["preto"]);
  });
});

describe("serializeFilters", () => {
  it("omits default values", () => {
    expect(serializeFilters(DEFAULT_FILTERS).toString()).toBe("");
  });

  it("round-trips through parseFilters", () => {
    const filters = {
      ...DEFAULT_FILTERS,
      query: "camiseta",
      categories: ["camisetas" as const],
      sizes: ["P" as const, "M" as const],
      maxPrice: 150,
      sort: "avaliacao" as const,
    };
    expect(parseFilters(serializeFilters(filters))).toEqual(filters);
  });
});
