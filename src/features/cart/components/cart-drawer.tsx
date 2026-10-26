"use client";

import { ShoppingBag } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { useI18n } from "@/i18n/i18n-provider";
import { formatPrice } from "@/lib/format";

import { useCart } from "../hooks";
import { useCartStore } from "../store";
import { CartLineItem } from "./cart-line-item";
import { FreeShippingProgress } from "./free-shipping-progress";

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isDrawerOpen);
  const close = useCartStore((state) => state.closeDrawer);
  const { lines, totals } = useCart();
  const isEmpty = lines.length === 0;
  const { locale, t: dictionary, routes } = useI18n();
  const t = dictionary.cart;

  return (
    <Sheet
      open={isOpen}
      onClose={close}
      title={isEmpty ? t.drawerTitle : t.drawerTitleWithCount(totals.itemCount)}
      footer={
        !isEmpty && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.subtotal}</span>
              <span className="text-lg font-semibold">{formatPrice(totals.subtotal, locale)}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t.drawerHint}</p>
            <div className="grid grid-cols-2 gap-2">
              <ButtonLink href={routes.cart} variant="outline" onClick={close}>
                {t.viewCart}
              </ButtonLink>
              <ButtonLink href={routes.checkout} onClick={close}>
                {t.checkoutShort}
              </ButtonLink>
            </div>
          </div>
        )
      }
    >
      {isEmpty ? (
        <div className="flex h-full flex-col items-center justify-center py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="size-7 text-muted-foreground" aria-hidden />
          </span>
          <p className="mt-4 font-semibold">{t.emptyTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.emptyDrawerText}</p>
          <ButtonLink
            href={routes.products("ordem=mais-vendidos")}
            className="mt-6"
            onClick={close}
          >
            {t.explore}
          </ButtonLink>
        </div>
      ) : (
        <div className="space-y-6">
          <FreeShippingProgress merchandiseTotal={totals.subtotal - totals.discount} />
          <ul className="divide-y divide-border" aria-label={dictionary.common.items(lines.length)}>
            {lines.map((line) => (
              <li key={line.key} className="py-4 first:pt-0">
                <CartLineItem line={line} compact onNavigate={close} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Sheet>
  );
}
