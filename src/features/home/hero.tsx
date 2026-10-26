import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import type { CategorySlug, ColorId } from "@/features/catalog";
import { ProductArt, type ArtView } from "@/features/catalog/components/product-art";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createRoutes } from "@/lib/routes";

const heroTiles: { category: CategorySlug; color: ColorId; view?: ArtView }[] = [
  { category: "moletons", color: "terracota", view: 2 },
  { category: "camisetas", color: "marinho" },
  { category: "tenis", color: "azul" },
  { category: "mochilas", color: "oliva", view: 2 },
];

function HeroTile({ category, color, view }: (typeof heroTiles)[number]) {
  return (
    <div className="overflow-hidden rounded-3xl shadow-xl shadow-black/5">
      <ProductArt
        category={category}
        color={color}
        view={view}
        label=""
        className="aspect-[4/5] w-full"
      />
    </div>
  );
}

export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).home;
  const routes = createRoutes(locale);
  return (
    <section className="relative overflow-hidden border-b border-border bg-accent-soft/60">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">{t.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-md text-lg text-pretty text-muted-foreground">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={routes.products()} size="lg">
              {t.shopNow}
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href={routes.products("ofertas=1")} size="lg" variant="outline">
              {t.deals}
            </ButtonLink>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">{t.statRating}</dt>
              <dd className="text-xl font-semibold">{t.statRatingValue}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t.statProducts}</dt>
              <dd className="text-xl font-semibold">40</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t.statShipping}</dt>
              <dd className="text-xl font-semibold">{t.statShippingValue}</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto flex w-full max-w-lg gap-4" aria-hidden>
          <div className="flex flex-1 flex-col gap-4">
            {heroTiles.slice(0, 2).map((tile) => (
              <HeroTile key={tile.category} {...tile} />
            ))}
          </div>
          <div className="mt-12 flex flex-1 flex-col gap-4">
            {heroTiles.slice(2).map((tile) => (
              <HeroTile key={tile.category} {...tile} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
