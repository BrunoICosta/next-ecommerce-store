import { ImageResponse } from "next/og";

import { OG_SIZE, OgCard } from "@/features/seo/og-card";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localeParams } from "@/i18n/server";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return localeParams();
}

/**
 * Open Graph image generated at build time for each language. A route handler
 * (instead of the opengraph-image convention) keeps the ".png" extension in
 * the exported file, so the static host serves it with the right Content-Type.
 */
export async function GET(_request: Request, { params }: RouteContext<"/[locale]/og.png">) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const t = getDictionary(locale).og;

  return new ImageResponse(
    <OgCard
      eyebrow={t.eyebrow}
      title={t.title}
      subtitle={t.subtitle}
      footer={t.footer}
      art={{ category: "moletons", color: "terracota" }}
    />,
    OG_SIZE,
  );
}
