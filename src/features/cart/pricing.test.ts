import { describe, expect, it } from "vitest";

import {
  amountUntilFreeShipping,
  calculateTotals,
  cartItemKey,
  findCoupon,
  formatCep,
  isValidCep,
  quoteShipping,
  resolveCartLines,
} from "./pricing";
import type { CartItem } from "./types";

// p001 = Camiseta Essencial Pima (R$ 129,90), p023 = Tênis Casual Couro (R$ 399,90)
const tshirt: CartItem = {
  key: cartItemKey("p001", "preto", "M"),
  productId: "p001",
  color: "preto",
  size: "M",
  quantity: 2,
};

describe("cep helpers", () => {
  it("validates and formats CEPs", () => {
    expect(isValidCep("01310-100")).toBe(true);
    expect(isValidCep("0131010")).toBe(false);
    expect(isValidCep("00000000")).toBe(false);
    expect(formatCep("01310100")).toBe("01310-100");
    expect(formatCep("0131")).toBe("0131");
  });
});

describe("findCoupon", () => {
  it("is case and whitespace insensitive", () => {
    expect(findCoupon(" bemvindo10 ")?.percentOff).toBe(10);
    expect(findCoupon("FRETEGRATIS")).toBeNull();
  });
});

describe("quoteShipping", () => {
  it("returns null for invalid CEPs", () => {
    expect(quoteShipping("123", 10_000)).toBeNull();
  });

  it("prices by region and makes economy shipping free above the threshold", () => {
    const [pac, sedex] = quoteShipping("01310100", 10_000) ?? [];
    expect(pac).toMatchObject({ id: "pac", price: 1490, minDays: 2, maxDays: 4 });
    expect(sedex.id).toBe("sedex");
    expect(sedex.price).toBeGreaterThan(pac.price);

    const [freePac, paidSedex] = quoteShipping("01310100", 29_900) ?? [];
    expect(freePac.price).toBe(0);
    expect(paidSedex.price).toBeGreaterThan(0);
  });

  it("charges more and takes longer for distant regions", () => {
    const [sp] = quoteShipping("01310100", 0) ?? [];
    const [north] = quoteShipping("69005070", 0) ?? [];
    expect(north.price).toBeGreaterThan(sp.price);
    expect(north.maxDays).toBeGreaterThan(sp.maxDays);
  });
});

describe("resolveCartLines", () => {
  it("joins items with catalog data and drops unknown products", () => {
    const lines = resolveCartLines(
      [tshirt, { key: "x", productId: "nope", color: "preto", size: "M", quantity: 1 }],
      "pt-BR",
    );
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ unitPrice: 12_990, lineTotal: 25_980 });
  });
});

describe("calculateTotals", () => {
  it("sums subtotal and item count without shipping when there is no CEP", () => {
    expect(
      calculateTotals({ items: [tshirt], coupon: null, cep: null, shippingMethod: "pac" }),
    ).toEqual({ itemCount: 2, subtotal: 25_980, discount: 0, shipping: null, total: 25_980 });
  });

  it("applies the coupon before computing shipping", () => {
    const totals = calculateTotals({
      items: [tshirt],
      coupon: findCoupon("BEMVINDO10"),
      cep: "01310100",
      shippingMethod: "pac",
    });
    expect(totals.discount).toBe(2_598);
    expect(totals.shipping).toBe(1_490);
    expect(totals.total).toBe(25_980 - 2_598 + 1_490);
  });

  it("gives free economy shipping for large orders", () => {
    const totals = calculateTotals({
      items: [{ ...tshirt, key: "k", productId: "p023", quantity: 1 }],
      coupon: null,
      cep: "90010000",
      shippingMethod: "pac",
    });
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBe(39_990);
  });
});

describe("amountUntilFreeShipping", () => {
  it("never goes below zero", () => {
    expect(amountUntilFreeShipping(20_000)).toBe(9_900);
    expect(amountUntilFreeShipping(50_000)).toBe(0);
  });
});
