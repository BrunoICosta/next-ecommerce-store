"use client";

import { ShoppingBag } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { formatPrice, pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";

import { useCart } from "../hooks";
import { useCartStore } from "../store";
import { CartLineItem } from "./cart-line-item";
import { FreeShippingProgress } from "./free-shipping-progress";

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isDrawerOpen);
  const close = useCartStore((state) => state.closeDrawer);
  const { lines, totals } = useCart();
  const isEmpty = lines.length === 0;

  return (
    <Sheet
      open={isOpen}
      onClose={close}
      title={isEmpty ? "Seu carrinho" : `Seu carrinho (${totals.itemCount})`}
      footer={
        !isEmpty && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-lg font-semibold">{formatPrice(totals.subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Frete e cupons são calculados no carrinho.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <ButtonLink href={routes.cart} variant="outline" onClick={close}>
                Ver carrinho
              </ButtonLink>
              <ButtonLink href={routes.checkout} onClick={close}>
                Finalizar
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
          <p className="mt-4 font-semibold">Seu carrinho está vazio</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Que tal dar uma olhada nos mais vendidos?
          </p>
          <ButtonLink
            href={routes.products("ordem=mais-vendidos")}
            className="mt-6"
            onClick={close}
          >
            Explorar produtos
          </ButtonLink>
        </div>
      ) : (
        <div className="space-y-6">
          <FreeShippingProgress merchandiseTotal={totals.subtotal - totals.discount} />
          <ul
            className="divide-y divide-border"
            aria-label={pluralize(lines.length, "item", "itens")}
          >
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
