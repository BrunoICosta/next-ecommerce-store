import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AddressData, CustomerData } from "./schemas";

export type CheckoutStep = 1 | 2 | 3;

interface CheckoutStore {
  step: CheckoutStep;
  customer: CustomerData | null;
  address: AddressData | null;
  saveCustomer: (customer: CustomerData) => void;
  saveAddress: (address: AddressData) => void;
  goToStep: (step: CheckoutStep) => void;
  reset: () => void;
}

/**
 * Checkout progress survives a refresh within the tab (sessionStorage).
 * Payment data is intentionally never persisted.
 */
export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      step: 1,
      customer: null,
      address: null,
      saveCustomer: (customer) => set({ customer, step: 2 }),
      saveAddress: (address) => set({ address, step: 3 }),
      goToStep: (step) => set({ step }),
      reset: () => set({ step: 1, customer: null, address: null }),
    }),
    {
      name: "trama-checkout",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
    },
  ),
);

export function useCheckoutHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useCheckoutStore.persist.onFinishHydration(onChange),
    () => useCheckoutStore.persist.hasHydrated(),
    () => false,
  );
}
