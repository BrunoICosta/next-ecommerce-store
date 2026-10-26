"use client";

import { Heart } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { getProductById, type Product } from "@/features/catalog";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { useI18n } from "@/i18n/i18n-provider";

import { useWishlistHydrated, useWishlistStore } from "../store";

export function WishlistView() {
  const hydrated = useWishlistHydrated();
  const productIds = useWishlistStore((state) => state.productIds);
  const clear = useWishlistStore((state) => state.clear);
  const { locale, t: dictionary, routes } = useI18n();
  const t = dictionary.wishlist;

  if (!hydrated) {
    return (
      <div className="grid animate-pulse grid-cols-2 gap-6 md:grid-cols-4" aria-hidden>
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="aspect-[4/5] rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  const products = productIds
    .map((id) => getProductById(id, locale))
    .filter((product): product is Product => product !== undefined);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-muted">
          <Heart className="size-7 text-muted-foreground" aria-hidden />
        </span>
        <h2 className="mt-4 text-xl font-semibold">{t.emptyTitle}</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">{t.emptyText}</p>
        <ButtonLink href={routes.products()} className="mt-6">
          {t.discover}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">{t.savedCount(products.length)}</p>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-muted-foreground underline-offset-4 hover:text-danger hover:underline"
        >
          {t.clear}
        </button>
      </div>
      <ProductGrid products={products} locale={locale} />
    </div>
  );
}
