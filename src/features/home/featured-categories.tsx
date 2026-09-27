import Link from "next/link";

import { categories, getCategoryCounts, getProductsByCategory } from "@/features/catalog";
import { ProductArt } from "@/features/catalog/components/product-art";
import { pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";

import { SectionHeading } from "./section-heading";

export function FeaturedCategories() {
  const counts = getCategoryCounts();

  return (
    <section aria-labelledby="categorias" className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHeading id="categorias" eyebrow="Explore" title="Compre por categoria" />
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => {
          const [cover] = getProductsByCategory(category.slug);
          return (
            <li key={category.slug}>
              <Link
                href={routes.category(category.slug)}
                className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <ProductArt
                  category={category.slug}
                  color={cover?.colors[1] ?? "preto"}
                  label=""
                  className="aspect-square w-full transition duration-500 group-hover:scale-105"
                />
                <span className="block px-4 py-3">
                  <span className="block font-semibold">{category.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {pluralize(counts[category.slug], "produto", "produtos")}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
