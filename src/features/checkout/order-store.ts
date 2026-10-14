import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Order } from "./order";

const MAX_ORDERS = 10;

interface OrderStore {
  orders: Order[];
  lastOrderId: string | null;
  addOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      lastOrderId: null,
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders].slice(0, MAX_ORDERS),
          lastOrderId: order.id,
        })),
    }),
    {
      name: "trama-orders",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export function useOrdersHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useOrderStore.persist.onFinishHydration(onChange),
    () => useOrderStore.persist.hasHydrated(),
    () => false,
  );
}

export const selectLastOrder = (state: OrderStore): Order | undefined =>
  state.orders.find((order) => order.id === state.lastOrderId);
