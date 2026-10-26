"use client";

import { useState } from "react";

import type { CategorySlug, ColorId } from "@/features/catalog";
import { getColor } from "@/features/catalog";
import { ProductArt, type ArtView } from "@/features/catalog/components/product-art";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/cn";

const VIEWS: ArtView[] = [0, 1, 2];

interface ProductGalleryProps {
  name: string;
  category: CategorySlug;
  color: ColorId;
}

export function ProductGallery({ name, category, color }: ProductGalleryProps) {
  const [active, setActive] = useState<ArtView>(0);
  const { locale, t: dictionary } = useI18n();
  const t = dictionary.product;
  const colorName = getColor(color, locale).name;

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start lg:sticky lg:top-32 lg:self-start">
      <ul className="flex gap-3 sm:flex-col" aria-label={t.gallery}>
        {VIEWS.map((view, index) => (
          <li key={view}>
            <button
              type="button"
              onClick={() => setActive(view)}
              aria-label={t.viewImage(index + 1, VIEWS.length, t.views[view])}
              aria-current={active === view}
              className={cn(
                "block w-20 overflow-hidden rounded-xl border-2 transition",
                active === view ? "border-foreground" : "border-transparent hover:border-border",
              )}
            >
              <ProductArt
                category={category}
                color={color}
                view={view}
                label=""
                className="aspect-[4/5] w-full"
              />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex-1 overflow-hidden rounded-3xl bg-muted">
        <ProductArt
          key={`${color}-${active}`}
          category={category}
          color={color}
          view={active}
          label={t.imageLabel(name, colorName, t.views[active])}
          className="aspect-[4/5] w-full animate-fade-in"
        />
      </div>
    </div>
  );
}
