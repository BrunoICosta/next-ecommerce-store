import type { Metadata } from "next";

import { CartView } from "@/features/cart/components/cart-view";

export const metadata: Metadata = {
  title: "Carrinho",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Carrinho</h1>
      <CartView />
    </main>
  );
}
