"use client";

import { Barcode, CheckCircle2, CreditCard, PackageSearch, Truck } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { OrderSummary } from "@/features/cart/components/order-summary";
import { formatCep } from "@/features/cart/pricing";
import { getColor, getProductById, sizeLabel } from "@/features/catalog";
import { ProductArt } from "@/features/catalog/components/product-art";
import { useI18n } from "@/i18n/i18n-provider";
import { formatDate, formatPrice } from "@/lib/format";

import type { Order } from "../order";
import { selectLastOrder, useOrdersHydrated, useOrderStore } from "../order-store";
import { CopyButton } from "./copy-button";
import { FakeQrCode } from "./fake-qr-code";

const BRAND_NAME = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  elo: "Elo",
} as const;

function PaymentDetails({ order }: { order: Order }) {
  const { locale, t: dictionary } = useI18n();
  const t = dictionary.order;
  const { payment } = order;
  const total = order.totals.total;

  if (payment.method === "card") {
    const brand = payment.brand === "unknown" ? t.cardFallback : BRAND_NAME[payment.brand];
    return (
      <div className="flex gap-4">
        <CreditCard className="size-6 shrink-0 text-accent" aria-hidden />
        <p>
          {t.cardApproved(
            brand,
            payment.last4,
            payment.installments,
            Math.ceil(total / payment.installments),
          )}
        </p>
      </div>
    );
  }

  if (payment.method === "pix") {
    return (
      <div className="flex flex-col gap-5 sm:flex-row">
        <FakeQrCode
          value={payment.code}
          label={t.qrLabel}
          className="size-40 shrink-0 rounded-xl text-black"
        />
        <div className="min-w-0 space-y-3">
          <p>{t.pixInstructions(total)}</p>
          <code className="block rounded-lg bg-muted p-3 text-xs break-all">{payment.code}</code>
          <CopyButton value={payment.code} label={t.copyPix} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="flex gap-3">
        <Barcode className="size-6 shrink-0 text-accent" aria-hidden />
        <span>{t.boletoInstructions(total, formatDate(payment.dueDate, locale))}</span>
      </p>
      <code className="block rounded-lg bg-muted p-3 text-sm break-all">{payment.line}</code>
      <CopyButton value={payment.line.replace(/\D/g, "")} label={t.copyBoleto} />
    </div>
  );
}

export function OrderConfirmation() {
  const hydrated = useOrdersHydrated();
  const order = useOrderStore(selectLastOrder);
  const { locale, t: dictionary, routes } = useI18n();
  const t = dictionary.order;

  if (!hydrated) {
    return <div className="h-96 animate-pulse rounded-3xl bg-muted" aria-hidden />;
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-20 text-center">
        <PackageSearch className="size-10 text-muted-foreground" aria-hidden />
        <h1 className="mt-4 text-2xl font-semibold">{t.emptyTitle}</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">{t.emptyText}</p>
        <ButtonLink href={routes.products()} className="mt-6">
          {t.goToStore}
        </ButtonLink>
      </div>
    );
  }

  const firstName = order.customer.fullName.split(" ")[0];
  const { address, shipping } = order;

  return (
    <div className="space-y-10">
      <header className="flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-success/15">
          <CheckCircle2 className="size-9 text-success" aria-hidden />
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          {order.payment.method === "card" ? t.confirmed : t.received}
        </h1>
        <p className="mt-3 max-w-lg text-muted-foreground">
          {t.thanks(firstName)}
          <strong>{order.customer.email}</strong>.
        </p>
        <p className="mt-4 rounded-full bg-muted px-4 py-2 text-sm">
          {t.number} <strong className="font-mono">{order.id}</strong> ·{" "}
          {formatDate(order.createdAt, locale)}
        </p>
      </header>

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <section
            aria-labelledby="pagamento"
            className="rounded-3xl border border-border bg-card p-6"
          >
            <h2 id="pagamento" className="mb-4 text-lg font-semibold">
              {t.payment}
            </h2>
            <PaymentDetails order={order} />
          </section>

          <section
            aria-labelledby="entrega"
            className="rounded-3xl border border-border bg-card p-6"
          >
            <h2 id="entrega" className="mb-4 text-lg font-semibold">
              {t.delivery}
            </h2>
            <div className="flex gap-4 text-sm">
              <Truck className="size-6 shrink-0 text-accent" aria-hidden />
              <div>
                <p className="font-medium">
                  {dictionary.shipping.methods[shipping.id]} ·{" "}
                  {dictionary.shipping.window(shipping.minDays, shipping.maxDays)}
                </p>
                <address className="mt-1 text-muted-foreground not-italic">
                  {address.street}, {address.number}
                  {address.complement ? ` – ${address.complement}` : ""}
                  <br />
                  {address.neighborhood} · {address.city}/{address.state} · CEP{" "}
                  {formatCep(address.cep)}
                </address>
              </div>
            </div>
          </section>

          <section aria-labelledby="itens" className="rounded-3xl border border-border bg-card p-6">
            <h2 id="itens" className="mb-4 text-lg font-semibold">
              {t.items}
            </h2>
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li
                  key={`${item.productId}-${item.color}-${item.size}`}
                  className="flex items-center gap-4 py-3 text-sm"
                >
                  <span className="w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <ProductArt
                      category={item.category}
                      color={item.color}
                      label=""
                      className="aspect-[4/5] w-full"
                    />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">
                      {/* Snapshot name as fallback if the product left the catalog. */}
                      {getProductById(item.productId, locale)?.name ?? item.name}
                    </span>
                    <span className="text-muted-foreground">
                      {getColor(item.color, locale).name}
                      {item.size !== "U" &&
                        ` · ${dictionary.common.sizeShort(sizeLabel(item.size, locale))}`}{" "}
                      · {dictionary.common.units(item.quantity)}
                    </span>
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.unitPrice * item.quantity, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <OrderSummary
          totals={order.totals}
          paymentDiscount={order.totals.paymentDiscount}
          title={t.values}
        >
          <ButtonLink href={routes.products()} variant="secondary" className="w-full">
            {t.keepShopping}
          </ButtonLink>
        </OrderSummary>
      </div>
    </div>
  );
}
