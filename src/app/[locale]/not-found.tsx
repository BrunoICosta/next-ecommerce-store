"use client";

import { SearchForm } from "@/components/layout/search-form";
import { ButtonLink } from "@/components/ui/button";
import { getBestSellers } from "@/features/catalog";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { useI18n } from "@/i18n/i18n-provider";

/** 404 inside the localized tree (e.g. notFound() from a page). */
export default function NotFound() {
  const { locale, t, routes } = useI18n();

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <title>{t.meta.notFoundTitle}</title>
      <section className="mx-auto flex max-w-xl flex-col items-center text-center">
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">
          {t.notFound.eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{t.notFound.title}</h1>
        <p className="mt-4 text-muted-foreground">{t.notFound.text}</p>
        <SearchForm className="mt-8 w-full max-w-md" />
        <ButtonLink href={routes.home} variant="outline" className="mt-4">
          {t.notFound.backHome}
        </ButtonLink>
      </section>

      <section aria-labelledby="sugestoes" className="mt-20">
        <h2 id="sugestoes" className="text-2xl font-bold tracking-tight">
          {t.notFound.suggestions}
        </h2>
        <ProductGrid products={getBestSellers(locale, 4)} locale={locale} className="mt-8" />
      </section>
    </main>
  );
}
