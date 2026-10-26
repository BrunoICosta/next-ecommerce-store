"use client";

import { ShoppingBag } from "lucide-react";

import { useI18n } from "@/i18n/i18n-provider";

import { useCartHydrated } from "../hooks";
import { selectItemCount, useCartStore } from "../store";

export function CartButton() {
  const hydrated = useCartHydrated();
  const count = useCartStore(selectItemCount);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const visibleCount = hydrated ? count : 0;
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative inline-flex size-10 items-center justify-center rounded-full hover:bg-muted"
      aria-label={visibleCount > 0 ? t.cart.openWithCount(visibleCount) : t.cart.open}
    >
      <ShoppingBag className="size-5" aria-hidden />
      {visibleCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
          {visibleCount > 99 ? "99+" : visibleCount}
        </span>
      )}
    </button>
  );
}
