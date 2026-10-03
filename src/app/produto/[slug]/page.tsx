import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  getAllProducts,
  getCategory,
  getProductBySlug,
  getRelatedProducts,
} from "@/features/catalog";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { ProductDetails } from "@/features/product/components/product-details";
import { routes } from "@/lib/routes";

/** Every product page is pre-rendered at build time; unknown slugs are a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps<"/produto/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getRelatedProducts(product, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Início", href: routes.home },
          { label: category.name, href: routes.category(category.slug) },
          { label: product.name },
        ]}
      />
      <div className="mt-6">
        <ProductDetails product={product} />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mt-20">
          <h2 id="relacionados" className="text-2xl font-bold tracking-tight">
            Você também pode gostar
          </h2>
          <ProductGrid products={related} className="mt-8" />
        </section>
      )}
    </main>
  );
}
