"use client";

import type { ReactNode } from "react";

import { useI18n } from "@/i18n/i18n-provider";
import { formatPrice } from "@/lib/format";

import type { CartTotals } from "../types";

interface OrderSummaryProps {
  totals: CartTotals;
  /** Extra discount applied at checkout (e.g. Pix), in cents. */
  paymentDiscount?: number;
  children?: ReactNode;
  title?: string;
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={tone === "success" ? "font-medium text-success" : "font-medium"}>{value}</dd>
    </div>
  );
}

export function OrderSummary({ totals, paymentDiscount = 0, children, title }: OrderSummaryProps) {
  const { locale, t: dictionary } = useI18n();
  const t = dictionary.summary;
  const money = (cents: number) => formatPrice(cents, locale);
  // Computed from the parts so cart, checkout and order snapshots render the same way.
  const total = totals.subtotal - totals.discount + (totals.shipping ?? 0) - paymentDiscount;

  return (
    <section
      aria-labelledby="resumo-pedido"
      className="space-y-5 rounded-3xl border border-border bg-card p-6"
    >
      <h2 id="resumo-pedido" className="text-lg font-semibold">
        {title ?? t.title}
      </h2>
      <dl className="space-y-3 text-sm">
        <Row label={t.subtotal(totals.itemCount)} value={money(totals.subtotal)} />
        {totals.discount > 0 && (
          <Row label={t.coupon} value={`− ${money(totals.discount)}`} tone="success" />
        )}
        <Row
          label={t.shipping}
          value={
            totals.shipping === null
              ? t.calculateShipping
              : totals.shipping === 0
                ? t.free
                : money(totals.shipping)
          }
          tone={totals.shipping === 0 ? "success" : undefined}
        />
        {paymentDiscount > 0 && (
          <Row label={t.pixDiscount} value={`− ${money(paymentDiscount)}`} tone="success" />
        )}
        <div className="flex items-center justify-between gap-4 border-t border-border pt-4 text-base">
          <dt className="font-semibold">{t.total}</dt>
          <dd className="text-xl font-bold">{money(total)}</dd>
        </div>
      </dl>
      {children}
    </section>
  );
}
