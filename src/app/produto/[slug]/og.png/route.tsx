import { ImageResponse } from "next/og";

import { getAllProducts, getCategory, getProductBySlug } from "@/features/catalog";
import { OG_SIZE, OgCard } from "@/features/seo/og-card";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/produto/[slug]/og.png">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    <OgCard
      eyebrow={getCategory(product.category).name}
      title={product.name}
      subtitle={product.tagline}
      footer={formatPrice(product.price)}
      art={{ category: product.category, color: product.colors[0] }}
    />,
    OG_SIZE,
  );
}
