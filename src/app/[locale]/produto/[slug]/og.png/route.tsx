import { ImageResponse } from "next/og";

import { getAllProducts, getCategory, getProductBySlug } from "@/features/catalog";
import { OG_SIZE, OgCard } from "@/features/seo/og-card";
import { isLocale, locales } from "@/i18n/config";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllProducts(locale).map((product) => ({ locale, slug: product.slug })),
  );
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/[locale]/produto/[slug]/og.png">,
) {
  const { locale, slug } = await params;
  const product = isLocale(locale) ? getProductBySlug(slug, locale) : undefined;
  if (!product || !isLocale(locale)) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    <OgCard
      eyebrow={getCategory(product.category, locale).name}
      title={product.name}
      subtitle={product.tagline}
      footer={formatPrice(product.price, locale)}
      art={{ category: product.category, color: product.colors[0] }}
    />,
    OG_SIZE,
  );
}
