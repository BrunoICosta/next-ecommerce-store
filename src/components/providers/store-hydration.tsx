"use client";

import { useEffect } from "react";

import { useCartStore } from "@/features/cart/store";
import { useOrderStore } from "@/features/checkout/order-store";
import { useCheckoutStore } from "@/features/checkout/store";
import { useWishlistStore } from "@/features/wishlist/store";

const persistedStores = [useCartStore, useWishlistStore, useCheckoutStore, useOrderStore];

/**
 * Persisted stores use `skipHydration`, so the static HTML always matches the
 * first client render. Here we load localStorage right after mount and keep
 * every open tab in sync through the `storage` event.
 */
export function StoreHydration() {
  useEffect(() => {
    persistedStores.forEach((store) => void store.persist.rehydrate());

    const onStorage = (event: StorageEvent) => {
      persistedStores.forEach((store) => {
        if (event.key === store.persist.getOptions().name) void store.persist.rehydrate();
      });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}
