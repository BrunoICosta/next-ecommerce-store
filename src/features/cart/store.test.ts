import { beforeEach, describe, expect, it } from "vitest";

import { MAX_QUANTITY_PER_ITEM } from "./pricing";
import { selectItemCount, useCartStore } from "./store";

const initial = useCartStore.getState();

describe("cart store", () => {
  beforeEach(() => {
    useCartStore.setState(initial, true);
  });

  it("adds items and merges the same variant", () => {
    const { addItem } = useCartStore.getState();
    addItem({ productId: "p001", color: "preto", size: "M" });
    addItem({ productId: "p001", color: "preto", size: "M", quantity: 2 });
    addItem({ productId: "p001", color: "branco", size: "M" });

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ key: "p001:preto:M", quantity: 3 });
    expect(selectItemCount(useCartStore.getState())).toBe(4);
  });

  it("clamps quantities between 1 and the maximum", () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem({ productId: "p001", color: "preto", size: "M", quantity: 50 });
    expect(useCartStore.getState().items[0].quantity).toBe(MAX_QUANTITY_PER_ITEM);

    updateQuantity("p001:preto:M", 0);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it("removes items and clears the cart with the coupon", () => {
    const { addItem, removeItem, applyCoupon, clear } = useCartStore.getState();
    addItem({ productId: "p001", color: "preto", size: "M" });
    addItem({ productId: "p002", color: "areia", size: "G" });
    removeItem("p001:preto:M");
    expect(useCartStore.getState().items.map((item) => item.productId)).toEqual(["p002"]);

    applyCoupon("bemvindo10");
    clear();
    expect(useCartStore.getState()).toMatchObject({ items: [], couponCode: null });
  });

  it("validates coupons", () => {
    const { applyCoupon } = useCartStore.getState();
    expect(applyCoupon("")).toEqual({ ok: false, error: "empty" });
    expect(applyCoupon("NATAL50")).toEqual({ ok: false, error: "invalid" });
    expect(applyCoupon("bemvindo10")).toEqual({ ok: true });
    expect(useCartStore.getState().couponCode).toBe("BEMVINDO10");
  });

  it("stores only valid CEPs, normalized to digits", () => {
    const { setCep } = useCartStore.getState();
    setCep("01310-100");
    expect(useCartStore.getState().cep).toBe("01310100");
    setCep("123");
    expect(useCartStore.getState().cep).toBeNull();
  });

  it("persists items but not UI state", async () => {
    useCartStore.getState().addItem({ productId: "p001", color: "preto", size: "M" });
    useCartStore.getState().openDrawer();
    const stored = JSON.parse(window.localStorage.getItem("trama-cart") ?? "{}");
    expect(stored.state.items).toHaveLength(1);
    expect(stored.state).not.toHaveProperty("isDrawerOpen");
  });
});
