import type { Metadata } from "next";

import { CatalogView } from "@/features/catalog/components/catalog-view";

export const metadata: Metadata = {
  title: "Todos os produtos",
  description:
    "Camisetas, moletons, calças, tênis, bonés e mochilas. Filtre por categoria, preço, cor, tamanho e avaliação.",
};

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Produtos</h1>
        <p className="mt-2 text-muted-foreground">
          Encontre a peça certa filtrando por categoria, preço, cor e tamanho.
        </p>
      </header>
      <CatalogView />
    </main>
  );
}
