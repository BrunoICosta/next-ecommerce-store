"use client";

import { useEffect } from "react";

import { useCartStore } from "@/features/cart/store";

/**
 * Persisted stores use `skipHydration`, so the static HTML always matches the
 * first client render. Here we load localStorage right after mount.
 */
export function StoreHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return null;
}
