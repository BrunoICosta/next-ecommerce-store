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
import { productJsonLd } from "@/features/seo/json-ld";
import { ogImage } from "@/features/seo/og-image";
import { locales } from "@/i18n/config";
import { localizedAlternates } from "@/i18n/metadata";
import { resolveLocale } from "@/i18n/server";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";

/** Every product page is pre-rendered at build time in every language. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllProducts(locale).map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/produto/[slug]">): Promise<Metadata> {
  const { locale, routes } = await resolveLocale(params);
  const { slug } = await params;
  const product = getProductBySlug(slug, locale);
  if (!product) return {};

  const url = absoluteUrl(routes.product(product.slug));
  const title = `${product.name} — ${formatPrice(product.price, locale)}`;
  const image = ogImage(`${url}og.png`, product.name);
  return {
    title: product.name,
    description: product.description,
    alternates: localizedAlternates(locale, `/produto/${product.slug}/`),
    openGraph: {
      type: "website",
      url,
      title,
      description: product.tagline,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.tagline,
      images: [image.url],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/[locale]/produto/[slug]">) {
  const { locale, t, routes } = await resolveLocale(params);
  const { slug } = await params;
  const product = getProductBySlug(slug, locale);
  if (!product) notFound();

  const category = getCategory(product.category, locale);
  const related = getRelatedProducts(product, locale, 4);
  const jsonLd = productJsonLd(product, category.name, locale);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        // JSON.stringify output is safe here: catalog data is static and contains no "</script>".
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        label={t.common.breadcrumb}
        items={[
          { label: t.common.home, href: routes.home },
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
            {t.product.related}
          </h2>
          <ProductGrid products={related} locale={locale} className="mt-8" />
        </section>
      )}
    </main>
  );
}
