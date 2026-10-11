"use client";

import { OrderSummary } from "@/features/cart/components/order-summary";
import type { CartLine, CartTotals } from "@/features/cart/types";
import { getColor } from "@/features/catalog";
import { ProductArt } from "@/features/catalog/components/product-art";
import { formatPrice } from "@/lib/format";

interface CheckoutSummaryProps {
  lines: CartLine[];
  totals: CartTotals;
  paymentDiscount?: number;
}

export function CheckoutSummary({ lines, totals, paymentDiscount }: CheckoutSummaryProps) {
  return (
    <OrderSummary totals={totals} paymentDiscount={paymentDiscount}>
      <ul className="space-y-3 border-t border-border pt-5" aria-label="Itens do pedido">
        {lines.map((line) => (
          <li key={line.key} className="flex items-center gap-3 text-sm">
            <span className="relative w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
              <ProductArt
                category={line.product.category}
                color={line.color}
                label=""
                className="aspect-[4/5] w-full"
              />
              <span className="absolute -top-0 -right-0 flex size-5 items-center justify-center rounded-bl-lg bg-foreground text-[11px] font-bold text-background">
                {line.quantity}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{line.product.name}</span>
              <span className="text-muted-foreground">
                {getColor(line.color).name}
                {line.size !== "U" && ` · ${line.size}`}
              </span>
            </span>
            <span className="font-medium">{formatPrice(line.lineTotal)}</span>
          </li>
        ))}
      </ul>
    </OrderSummary>
  );
}
