import type { ReactNode } from "react";

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

export function OrderSummary({
  totals,
  paymentDiscount = 0,
  children,
  title = "Resumo do pedido",
}: OrderSummaryProps) {
  const total = totals.total - paymentDiscount;

  return (
    <section
      aria-labelledby="resumo-pedido"
      className="space-y-5 rounded-3xl border border-border bg-card p-6"
    >
      <h2 id="resumo-pedido" className="text-lg font-semibold">
        {title}
      </h2>
      <dl className="space-y-3 text-sm">
        <Row
          label={`Subtotal (${totals.itemCount} ${totals.itemCount === 1 ? "item" : "itens"})`}
          value={formatPrice(totals.subtotal)}
        />
        {totals.discount > 0 && (
          <Row label="Cupom" value={`− ${formatPrice(totals.discount)}`} tone="success" />
        )}
        <Row
          label="Frete"
          value={
            totals.shipping === null
              ? "Calcule pelo CEP"
              : totals.shipping === 0
                ? "Grátis"
                : formatPrice(totals.shipping)
          }
          tone={totals.shipping === 0 ? "success" : undefined}
        />
        {paymentDiscount > 0 && (
          <Row label="Desconto Pix" value={`− ${formatPrice(paymentDiscount)}`} tone="success" />
        )}
        <div className="flex items-center justify-between gap-4 border-t border-border pt-4 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="text-xl font-bold">{formatPrice(total)}</dd>
        </div>
      </dl>
      {children}
    </section>
  );
}
