"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n-provider";
import { maxInstallments } from "@/lib/format";

import { useCart, useCartHydrated } from "../hooks";
import { useCartStore } from "../store";
import { CartLineItem } from "./cart-line-item";
import { CouponForm } from "./coupon-form";
import { FreeShippingProgress } from "./free-shipping-progress";
import { OrderSummary } from "./order-summary";
import { ShippingCalculator } from "./shipping-calculator";

function CartSkeleton() {
  return (
    <div
      className="grid animate-pulse grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_380px]"
      aria-hidden
    >
      <div className="space-y-4">
        {[0, 1].map((index) => (
          <div key={index} className="h-36 rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="h-80 rounded-3xl bg-muted" />
    </div>
  );
}

export function CartView() {
  const hydrated = useCartHydrated();
  const { lines, totals, coupon } = useCart();
  const clear = useCartStore((state) => state.clear);
  const { t: dictionary, routes } = useI18n();
  const t = dictionary.cart;

  if (!hydrated) return <CartSkeleton />;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-7 text-muted-foreground" aria-hidden />
        </span>
        <h2 className="mt-4 text-xl font-semibold">{t.emptyTitle}</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">{t.emptyText}</p>
        <ButtonLink href={routes.products()} className="mt-6">
          {t.seeProducts}
        </ButtonLink>
      </div>
    );
  }

  const merchandiseTotal = totals.subtotal - totals.discount;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section aria-labelledby="itens-carrinho">
        <div className="flex items-center justify-between">
          <h2 id="itens-carrinho" className="text-lg font-semibold">
            {t.itemsHeading(totals.itemCount)}
          </h2>
          <button
            type="button"
            onClick={clear}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-danger hover:underline"
          >
            {t.clear}
          </button>
        </div>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {lines.map((line) => (
            <li key={line.key} className="py-5">
              <CartLineItem line={line} />
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <FreeShippingProgress merchandiseTotal={merchandiseTotal} />
        </div>
      </section>

      <div className="space-y-6 lg:sticky lg:top-32">
        <OrderSummary totals={totals}>
          <div className="space-y-5 border-t border-border pt-5">
            <ShippingCalculator merchandiseTotal={merchandiseTotal} />
            <CouponForm coupon={coupon} />
          </div>
          <ButtonLink href={routes.checkout} size="lg" className="w-full">
            {t.checkout}
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <p className="text-center text-xs text-muted-foreground">
            {t.installmentsHint(
              maxInstallments(totals.total),
              Math.ceil(totals.total / maxInstallments(totals.total)),
            )}
          </p>
        </OrderSummary>
      </div>
    </div>
  );
}
