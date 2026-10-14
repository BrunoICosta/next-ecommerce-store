import type { Metadata } from "next";

import { OrderConfirmation } from "@/features/checkout/components/order-confirmation";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false },
};

export default function OrderConfirmationPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <OrderConfirmation />
    </main>
  );
}
