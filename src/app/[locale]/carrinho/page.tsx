import type { Metadata } from "next";

import { CartView } from "@/features/cart/components/cart-view";
import { resolveLocale } from "@/i18n/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/carrinho">): Promise<Metadata> {
  const { t } = await resolveLocale(params);
  return { title: t.meta.cartTitle, robots: { index: false } };
}

export default async function CartPage({ params }: PageProps<"/[locale]/carrinho">) {
  const { t } = await resolveLocale(params);
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">{t.cart.title}</h1>
      <CartView />
    </main>
  );
}
