import type { Metadata } from "next";
import { Suspense } from "react";

import { getAllProducts } from "@/features/catalog";
import { CatalogView } from "@/features/catalog/components/catalog-view";
import { ProductGrid } from "@/features/catalog/components/product-grid";

export const metadata: Metadata = {
  title: "Todos os produtos",
  description:
    "Camisetas, moletons, calças, tênis, bonés e mochilas. Filtre por categoria, preço, cor, tamanho e avaliação.",
};

/**
 * With `output: "export"` there is no server to read the query string, so the
 * filtered view reads useSearchParams() on the client. The Suspense fallback is
 * the full, unfiltered grid: the static HTML is still complete and crawlable.
 */
export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Produtos</h1>
        <p className="mt-2 text-muted-foreground">
          Encontre a peça certa filtrando por categoria, preço, cor e tamanho.
        </p>
      </header>
      <Suspense fallback={<ProductGrid products={getAllProducts()} className="lg:ml-[292px]" />}>
        <CatalogView />
      </Suspense>
    </main>
  );
}
