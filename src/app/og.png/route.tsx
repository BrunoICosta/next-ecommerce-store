import { ImageResponse } from "next/og";

import { OG_SIZE, OgCard } from "@/features/seo/og-card";

export const dynamic = "force-static";

/**
 * Open Graph image generated at build time. A route handler (instead of the
 * opengraph-image convention) keeps the ".png" extension in the exported file,
 * so GitHub Pages serves it with the right Content-Type.
 */
export function GET() {
  return new ImageResponse(
    <OgCard
      eyebrow="Coleção primavera 2026"
      title="Básicos bem feitos para vestir todo dia."
      subtitle="Camisetas, moletons, tênis e acessórios."
      footer="Frete grátis acima de R$ 299"
      art={{ category: "moletons", color: "terracota" }}
    />,
    OG_SIZE,
  );
}
