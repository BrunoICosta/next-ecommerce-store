"use client";

import { ShoppingBag } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { useCart, useCartHydrated } from "@/features/cart/hooks";
import { routes } from "@/lib/routes";

import { useCheckoutHydrated, useCheckoutStore } from "../store";
import { CheckoutStepper } from "./checkout-stepper";
import { CheckoutSummary } from "./checkout-summary";
import { CustomerStep } from "./customer-step";

function CheckoutSkeleton() {
  return (
    <div className="grid animate-pulse gap-10 lg:grid-cols-[1fr_400px]" aria-hidden>
      <div className="h-96 rounded-3xl bg-muted" />
      <div className="h-80 rounded-3xl bg-muted" />
    </div>
  );
}

export function CheckoutView() {
  const cartHydrated = useCartHydrated();
  const checkoutHydrated = useCheckoutHydrated();
  const { lines, totals } = useCart();
  const step = useCheckoutStore((state) => state.step);
  const customer = useCheckoutStore((state) => state.customer);
  const saveCustomer = useCheckoutStore((state) => state.saveCustomer);
  const goToStep = useCheckoutStore((state) => state.goToStep);

  if (!cartHydrated || !checkoutHydrated) return <CheckoutSkeleton />;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-20 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" aria-hidden />
        <h2 className="mt-4 text-xl font-semibold">Seu carrinho está vazio</h2>
        <p className="mt-2 text-muted-foreground">Adicione produtos para finalizar a compra.</p>
        <ButtonLink href={routes.products()} className="mt-6">
          Ver produtos
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_400px]">
      <div className="space-y-8">
        <CheckoutStepper current={step} onSelect={goToStep} />
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-8">
          {step === 1 && <CustomerStep defaultValues={customer} onSubmit={saveCustomer} />}
          {step > 1 && <p className="text-muted-foreground">Próximas etapas em desenvolvimento.</p>}
        </div>
      </div>
      <div className="lg:sticky lg:top-32">
        <CheckoutSummary lines={lines} totals={totals} />
      </div>
    </div>
  );
}
