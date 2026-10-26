"use client";

import { OrderSummary } from "@/features/cart/components/order-summary";
import type { CartLine, CartTotals } from "@/features/cart/types";
import { getColor, sizeLabel } from "@/features/catalog";
import { ProductArt } from "@/features/catalog/components/product-art";
import { useI18n } from "@/i18n/i18n-provider";
import { formatPrice } from "@/lib/format";

interface CheckoutSummaryProps {
  lines: CartLine[];
  totals: CartTotals;
  paymentDiscount?: number;
}

export function CheckoutSummary({ lines, totals, paymentDiscount }: CheckoutSummaryProps) {
  const { locale, t } = useI18n();
  return (
    <OrderSummary totals={totals} paymentDiscount={paymentDiscount}>
      <ul className="space-y-3 border-t border-border pt-5" aria-label={t.summary.orderItems}>
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
                {getColor(line.color, locale).name}
                {line.size !== "U" && ` · ${sizeLabel(line.size, locale)}`}
              </span>
            </span>
            <span className="font-medium">{formatPrice(line.lineTotal, locale)}</span>
          </li>
        ))}
      </ul>
    </OrderSummary>
  );
}
