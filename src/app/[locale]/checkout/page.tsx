import { Lock } from "lucide-react";
import type { Metadata } from "next";

import { CheckoutView } from "@/features/checkout/components/checkout-view";
import { resolveLocale } from "@/i18n/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/checkout">): Promise<Metadata> {
  const { t } = await resolveLocale(params);
  return { title: t.meta.checkoutTitle, robots: { index: false } };
}

export default async function CheckoutPage({ params }: PageProps<"/[locale]/checkout">) {
  const { t } = await resolveLocale(params);
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.checkout.title}</h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="size-4" aria-hidden />
          {t.checkout.demoNotice}
        </p>
      </div>
      <CheckoutView />
    </main>
  );
}
