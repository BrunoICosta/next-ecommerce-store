import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ColorId, Size } from "@/features/catalog";

import { cartItemKey, findCoupon, isValidCep, MAX_QUANTITY_PER_ITEM, sanitizeCep } from "./pricing";
import type { CartItem, ShippingMethodId } from "./types";

/** Error codes are translated by the UI. */
export type CouponError = "empty" | "invalid";
export type CouponResult = { ok: true } | { ok: false; error: CouponError };

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  cep: string | null;
  shippingMethod: ShippingMethodId;
  isDrawerOpen: boolean;
}

interface CartActions {
  addItem: (input: { productId: string; color: ColorId; size: Size; quantity?: number }) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => CouponResult;
  removeCoupon: () => void;
  setCep: (cep: string | null) => void;
  setShippingMethod: (method: ShippingMethodId) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export type CartStore = CartState & CartActions;

const initialState: CartState = {
  items: [],
  couponCode: null,
  cep: null,
  shippingMethod: "pac",
  isDrawerOpen: false,
};

const clampQuantity = (quantity: number) =>
  Math.max(1, Math.min(MAX_QUANTITY_PER_ITEM, Math.floor(quantity)));

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      ...initialState,

      addItem: ({ productId, color, size, quantity = 1 }) =>
        set((state) => {
          const key = cartItemKey(productId, color, size);
          const existing = state.items.find((item) => item.key === key);
          const items = existing
            ? state.items.map((item) =>
                item.key === key
                  ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
                  : item,
              )
            : [...state.items, { key, productId, color, size, quantity: clampQuantity(quantity) }];
          return { items };
        }),

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key ? { ...item, quantity: clampQuantity(quantity) } : item,
          ),
        })),

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((item) => item.key !== key) })),

      clear: () => set({ items: [], couponCode: null }),

      applyCoupon: (code) => {
        if (!code.trim()) return { ok: false, error: "empty" };
        const coupon = findCoupon(code);
        if (!coupon) return { ok: false, error: "invalid" };
        set({ couponCode: coupon.code });
        return { ok: true };
      },

      removeCoupon: () => set({ couponCode: null }),

      setCep: (cep) => set({ cep: cep && isValidCep(cep) ? sanitizeCep(cep) : null }),

      setShippingMethod: (shippingMethod) => set({ shippingMethod }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: "trama-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated manually after mount (see StoreHydration) to avoid SSR mismatches.
      skipHydration: true,
      partialize: ({ items, couponCode, cep, shippingMethod }) => ({
        items,
        couponCode,
        cep,
        shippingMethod,
      }),
    },
  ),
);

export const selectItemCount = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
