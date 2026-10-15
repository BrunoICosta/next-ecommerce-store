import type { CategorySlug, ColorId } from "@/features/catalog";
import { ProductArt } from "@/features/catalog/components/product-art";

export const OG_SIZE = { width: 1200, height: 630 };

interface OgCardProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer?: string;
  art?: { category: CategorySlug; color: ColorId };
}

export function OgCard({ eyebrow, title, subtitle, footer, art }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#faf8f5",
        color: "#1c1917",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#c2410c",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 700 }}>trama</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 26, color: "#c2410c", letterSpacing: 4, fontWeight: 700 }}>
            {eyebrow.toUpperCase()}
          </div>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 30, color: "#57534e" }}>{subtitle}</div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{footer ?? ""}</div>
      </div>
      {art && (
        <div style={{ display: "flex", width: 504, height: 630 }}>
          <ProductArt category={art.category} color={art.color} label="" width={504} height={630} />
        </div>
      )}
    </div>
  );
}
