"use client";

import { useState } from "react";

import type { CategorySlug, ColorId } from "@/features/catalog";
import { getColor } from "@/features/catalog";
import { ProductArt, type ArtView } from "@/features/catalog/components/product-art";
import { cn } from "@/lib/cn";

const VIEWS: { view: ArtView; label: string }[] = [
  { view: 0, label: "Frente" },
  { view: 1, label: "Detalhe" },
  { view: 2, label: "Ambiente" },
];

interface ProductGalleryProps {
  name: string;
  category: CategorySlug;
  color: ColorId;
}

export function ProductGallery({ name, category, color }: ProductGalleryProps) {
  const [active, setActive] = useState<ArtView>(0);
  const colorName = getColor(color).name;

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start lg:sticky lg:top-32 lg:self-start">
      <ul className="flex gap-3 sm:flex-col" aria-label="Imagens do produto">
        {VIEWS.map(({ view, label }, index) => (
          <li key={view}>
            <button
              type="button"
              onClick={() => setActive(view)}
              aria-label={`Ver imagem ${index + 1} de ${VIEWS.length}: ${label}`}
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
          label={`${name} na cor ${colorName}, imagem: ${VIEWS[active].label.toLowerCase()}`}
          className="aspect-[4/5] w-full animate-fade-in"
        />
      </div>
    </div>
  );
}
