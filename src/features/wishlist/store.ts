import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WishlistStore {
  productIds: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      productIds: [],
      toggle: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [productId, ...state.productIds],
        })),
      remove: (productId) =>
        set((state) => ({ productIds: state.productIds.filter((id) => id !== productId) })),
      clear: () => set({ productIds: [] }),
    }),
    {
      name: "trama-wishlist",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export function useWishlistHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useWishlistStore.persist.onFinishHydration(onChange),
    () => useWishlistStore.persist.hasHydrated(),
    () => false,
  );
}
