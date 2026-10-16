import type { Metadata } from "next";

import { SearchForm } from "@/components/layout/search-form";
import { ButtonLink } from "@/components/ui/button";
import { getBestSellers } from "@/features/catalog";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <section className="mx-auto flex max-w-xl flex-col items-center text-center">
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">Erro 404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Essa página saiu de linha
        </h1>
        <p className="mt-4 text-muted-foreground">
          O endereço pode ter mudado ou o produto não está mais disponível. Que tal buscar o que
          você procura?
        </p>
        <SearchForm className="mt-8 w-full max-w-md" />
        <ButtonLink href={routes.home} variant="outline" className="mt-4">
          Voltar para o início
        </ButtonLink>
      </section>

      <section aria-labelledby="sugestoes" className="mt-20">
        <h2 id="sugestoes" className="text-2xl font-bold tracking-tight">
          Mais vendidos
        </h2>
        <ProductGrid products={getBestSellers(4)} className="mt-8" />
      </section>
    </main>
  );
}
