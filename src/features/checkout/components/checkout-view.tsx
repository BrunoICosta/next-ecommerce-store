"use client";

import { LoaderCircle, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { useCart, useCartHydrated } from "@/features/cart/hooks";
import { useCartStore } from "@/features/cart/store";
import { useI18n } from "@/i18n/i18n-provider";

import { calculatePaymentDiscount, createOrder } from "../order";
import { useOrderStore } from "../order-store";
import type { PaymentData, PaymentMethod } from "../schemas";
import { useCheckoutHydrated, useCheckoutStore, type CheckoutStep } from "../store";
import { AddressStep } from "./address-step";
import { CheckoutStepper } from "./checkout-stepper";
import { CheckoutSummary } from "./checkout-summary";
import { CustomerStep } from "./customer-step";
import { PaymentStep } from "./payment-step";

/** Simulated gateway latency so the processing state is visible. */
const PAYMENT_DELAY_MS = 1200;

function CheckoutSkeleton() {
  return (
    <div
      className="grid animate-pulse grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_400px]"
      aria-hidden
    >
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
  const address = useCheckoutStore((state) => state.address);
  const saveCustomer = useCheckoutStore((state) => state.saveCustomer);
  const saveAddress = useCheckoutStore((state) => state.saveAddress);
  const goToStep = useCheckoutStore((state) => state.goToStep);
  const resetCheckout = useCheckoutStore((state) => state.reset);
  const clearCart = useCartStore((state) => state.clear);
  const addOrder = useOrderStore((state) => state.addOrder);
  const router = useRouter();
  const { t, routes } = useI18n();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [redirecting, setRedirecting] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Never show a step whose prerequisites are missing (e.g. cleared session).
  const currentStep: CheckoutStep = !customer ? 1 : !address && step === 3 ? 2 : step;

  const previousStep = useRef(currentStep);
  useEffect(() => {
    if (previousStep.current === currentStep) return;
    previousStep.current = currentStep;
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [currentStep]);

  const amountFor = useCallback(
    (method: PaymentMethod) => totals.total - calculatePaymentDiscount(totals, method),
    [totals],
  );

  async function placeOrder(payment: PaymentData) {
    if (!customer || !address) return;
    await new Promise((resolve) => setTimeout(resolve, PAYMENT_DELAY_MS));
    const order = createOrder({ lines, totals, customer, address, payment });
    addOrder(order);
    setRedirecting(true);
    router.push(routes.orderConfirmation);
    clearCart();
    resetCheckout();
  }

  if (redirecting) {
    return (
      <div
        className="flex items-center justify-center gap-3 py-24 text-muted-foreground"
        role="status"
      >
        <LoaderCircle className="size-5 animate-spin" aria-hidden />
        {t.checkout.redirecting}
      </div>
    );
  }

  if (!cartHydrated || !checkoutHydrated) return <CheckoutSkeleton />;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-20 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" aria-hidden />
        <h2 className="mt-4 text-xl font-semibold">{t.checkout.emptyTitle}</h2>
        <p className="mt-2 text-muted-foreground">{t.checkout.emptyText}</p>
        <ButtonLink href={routes.products()} className="mt-6">
          {t.cart.seeProducts}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div
      ref={topRef}
      className="grid scroll-mt-32 grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px]"
    >
      <div className="space-y-8">
        <CheckoutStepper current={currentStep} onSelect={goToStep} />
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-8">
          {currentStep === 1 && <CustomerStep defaultValues={customer} onSubmit={saveCustomer} />}
          {currentStep === 2 && (
            <AddressStep
              defaultValues={address}
              merchandiseTotal={totals.subtotal - totals.discount}
              onBack={() => goToStep(1)}
              onSubmit={saveAddress}
            />
          )}
          {currentStep === 3 && (
            <PaymentStep
              amountFor={amountFor}
              onMethodChange={setPaymentMethod}
              onBack={() => goToStep(2)}
              onSubmit={placeOrder}
            />
          )}
        </div>
      </div>
      <div className="lg:sticky lg:top-32">
        <CheckoutSummary
          lines={lines}
          totals={totals}
          paymentDiscount={
            currentStep === 3 ? calculatePaymentDiscount(totals, paymentMethod) : undefined
          }
        />
      </div>
    </div>
  );
}
