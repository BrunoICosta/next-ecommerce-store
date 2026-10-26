import type { Metadata } from "next";

import { getBestSellers, getNewArrivals } from "@/features/catalog";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { FeaturedCategories } from "@/features/home/featured-categories";
import { Hero } from "@/features/home/hero";
import { SectionHeading } from "@/features/home/section-heading";
import { ValueProps } from "@/features/home/value-props";
import { localizedAlternates } from "@/i18n/metadata";
import { resolveLocale } from "@/i18n/server";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return { alternates: localizedAlternates(locale, "/") };
}

/** Home is a Server Component: rendered once per language at build time. */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale, t, routes } = await resolveLocale(params);
  const bestSellers = getBestSellers(locale, 8);
  const newArrivals = getNewArrivals(locale, 4);

  return (
    <main className="flex flex-col gap-16 pb-8 sm:gap-20">
      <Hero locale={locale} />
      <ValueProps locale={locale} />
      <FeaturedCategories locale={locale} />

      <section aria-labelledby="mais-vendidos" className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="mais-vendidos"
          eyebrow={t.home.bestSellersEyebrow}
          title={t.home.bestSellersTitle}
          action={{ href: routes.products("ordem=mais-vendidos"), label: t.home.seeAll }}
        />
        <ProductGrid products={bestSellers} locale={locale} className="mt-8" />
      </section>

      <section aria-labelledby="novidades" className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="novidades"
          eyebrow={t.home.newEyebrow}
          title={t.home.newTitle}
          action={{ href: routes.products("ordem=novidades"), label: t.home.seeNew }}
        />
        <ProductGrid products={newArrivals} locale={locale} className="mt-8" />
      </section>
    </main>
  );
}
