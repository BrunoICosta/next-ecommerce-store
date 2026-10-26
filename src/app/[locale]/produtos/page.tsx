import type { Metadata } from "next";
import { Suspense } from "react";

import { getAllProducts } from "@/features/catalog";
import { CatalogView } from "@/features/catalog/components/catalog-view";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { localizedAlternates } from "@/i18n/metadata";
import { resolveLocale } from "@/i18n/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/produtos">): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return {
    title: t.meta.productsTitle,
    description: t.meta.productsDescription,
    alternates: localizedAlternates(locale, "/produtos/"),
  };
}

/**
 * With `output: "export"` there is no server to read the query string, so the
 * filtered view reads useSearchParams() on the client. The Suspense fallback is
 * the first products of the unfiltered grid, so the static HTML has real
 * content (every product page is also listed in the sitemap) while staying light.
 */
const FALLBACK_COUNT = 12;

export default async function ProductsPage({ params }: PageProps<"/[locale]/produtos">) {
  const { locale, t } = await resolveLocale(params);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.catalog.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.catalog.subtitle}</p>
      </header>
      <h2 className="sr-only">{t.catalog.results}</h2>
      <Suspense
        fallback={
          <ProductGrid
            products={getAllProducts(locale).slice(0, FALLBACK_COUNT)}
            locale={locale}
            className="lg:ml-[292px]"
          />
        }
      >
        <CatalogView />
      </Suspense>
    </main>
  );
}
