import type { Metadata } from "next";

import { getBestSellers, getNewArrivals } from "@/features/catalog";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { FeaturedCategories } from "@/features/home/featured-categories";
import { Hero } from "@/features/home/hero";
import { SectionHeading } from "@/features/home/section-heading";
import { ValueProps } from "@/features/home/value-props";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

/** Home is a Server Component: rendered once at build time, zero client JS of its own. */
export default function HomePage() {
  const bestSellers = getBestSellers(8);
  const newArrivals = getNewArrivals(4);

  return (
    <main className="flex flex-col gap-16 pb-8 sm:gap-20">
      <Hero />
      <ValueProps />
      <FeaturedCategories />

      <section aria-labelledby="mais-vendidos" className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="mais-vendidos"
          eyebrow="Os favoritos"
          title="Mais vendidos"
          action={{ href: routes.products("ordem=mais-vendidos"), label: "Ver todos" }}
        />
        <ProductGrid products={bestSellers} className="mt-8" />
      </section>

      <section aria-labelledby="novidades" className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="novidades"
          eyebrow="Acabou de chegar"
          title="Novidades"
          action={{ href: routes.products("ordem=novidades"), label: "Ver novidades" }}
        />
        <ProductGrid products={newArrivals} className="mt-8" />
      </section>
    </main>
  );
}
