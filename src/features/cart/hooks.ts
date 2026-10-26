"use client";

import { useMemo, useSyncExternalStore } from "react";

import { useI18n } from "@/i18n/i18n-provider";

import { calculateTotals, findCoupon, resolveCartLines } from "./pricing";
import { useCartStore } from "./store";

/**
 * True once the persisted cart was read from localStorage. Until then the UI
 * renders the server snapshot (an empty cart) to keep hydration consistent.
 */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useCartStore.persist.onFinishHydration(onChange),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}

export function useCart() {
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const cep = useCartStore((state) => state.cep);
  const shippingMethod = useCartStore((state) => state.shippingMethod);
  const { locale } = useI18n();

  return useMemo(() => {
    const coupon = couponCode ? findCoupon(couponCode) : null;
    return {
      items,
      lines: resolveCartLines(items, locale),
      coupon,
      cep,
      shippingMethod,
      totals: calculateTotals({ items, coupon, cep, shippingMethod }),
    };
  }, [items, couponCode, cep, shippingMethod, locale]);
}
