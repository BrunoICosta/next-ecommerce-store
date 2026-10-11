import { Lock } from "lucide-react";
import type { Metadata } from "next";

import { CheckoutView } from "@/features/checkout/components/checkout-view";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Finalizar compra</h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="size-4" aria-hidden />
          Ambiente de demonstração: nenhum pagamento é processado
        </p>
      </div>
      <CheckoutView />
    </main>
  );
}
