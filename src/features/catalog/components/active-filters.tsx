"use client";

import { X } from "lucide-react";

import { formatRating } from "@/lib/format";

import { getCategory } from "../data/categories";
import { getColor } from "../data/colors";
import type { CatalogFilters } from "../filters";

interface ActiveFiltersProps {
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onClear: () => void;
}

interface Chip {
  key: string;
  label: string;
  remove: Partial<CatalogFilters>;
}

function priceLabel(min: number | null, max: number | null): string {
  if (min !== null && max !== null) return `R$ ${min} a R$ ${max}`;
  if (min !== null) return `A partir de R$ ${min}`;
  return `Até R$ ${max}`;
}

export function ActiveFilters({ filters, onChange, onClear }: ActiveFiltersProps) {
  const chips: Chip[] = [
    ...(filters.query
      ? [{ key: "q", label: `Busca: “${filters.query}”`, remove: { query: "" } }]
      : []),
    ...filters.categories.map((slug) => ({
      key: `cat-${slug}`,
      label: getCategory(slug).name,
      remove: { categories: filters.categories.filter((item) => item !== slug) },
    })),
    ...filters.colors.map((id) => ({
      key: `color-${id}`,
      label: getColor(id).name,
      remove: { colors: filters.colors.filter((item) => item !== id) },
    })),
    ...filters.sizes.map((size) => ({
      key: `size-${size}`,
      label: size === "U" ? "Tamanho único" : `Tam. ${size}`,
      remove: { sizes: filters.sizes.filter((item) => item !== size) },
    })),
    ...(filters.minPrice !== null || filters.maxPrice !== null
      ? [
          {
            key: "price",
            label: priceLabel(filters.minPrice, filters.maxPrice),
            remove: { minPrice: null, maxPrice: null },
          },
        ]
      : []),
    ...(filters.minRating !== null
      ? [
          {
            key: "rating",
            label: `${formatRating(filters.minRating)}+ estrelas`,
            remove: { minRating: null },
          },
        ]
      : []),
    ...(filters.onSale ? [{ key: "sale", label: "Ofertas", remove: { onSale: false } }] : []),
  ];

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ul className="flex flex-wrap gap-2" aria-label="Filtros aplicados">
        {chips.map((chip) => (
          <li key={chip.key}>
            <button
              type="button"
              onClick={() => onChange(chip.remove)}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted py-1.5 pr-2.5 pl-3 text-xs font-medium hover:bg-border"
              aria-label={`Remover filtro ${chip.label}`}
            >
              {chip.label}
              <X className="size-3.5" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClear}
        className="text-xs font-semibold text-accent underline-offset-4 hover:underline"
      >
        Limpar tudo
      </button>
    </div>
  );
}
