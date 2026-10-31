import { describe, expect, it } from "vitest";

import { en } from "./en";
import { ptBR } from "./pt-BR";

/** Structural fingerprint: keys, array lengths and which entries are functions. */
function shape(value: unknown): unknown {
  if (typeof value === "function") return "fn";
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entry]) => [key, shape(entry)]),
    );
  }
  return typeof value;
}

describe("dictionaries", () => {
  it("have the same keys, arrays and interpolation functions in every language", () => {
    expect(shape(en)).toEqual(shape(ptBR));
  });

  it("format prices with the locale but always in BRL", () => {
    expect(ptBR.common.each(12_990)).toBe("R$ 129,90 cada");
    expect(en.common.each(12_990)).toBe("R$129.90 each");
  });

  it("pluralize counts", () => {
    expect(ptBR.common.products(1)).toBe("1 produto");
    expect(en.catalog.found(2)).toBe("2 products found");
  });
});
