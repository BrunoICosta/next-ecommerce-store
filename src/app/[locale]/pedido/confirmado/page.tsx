import type { Metadata } from "next";

import { OrderConfirmation } from "@/features/checkout/components/order-confirmation";
import { resolveLocale } from "@/i18n/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/pedido/confirmado">): Promise<Metadata> {
  const { t } = await resolveLocale(params);
  return { title: t.meta.orderTitle, robots: { index: false } };
}

export default function OrderConfirmationPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <OrderConfirmation />
    </main>
  );
}
