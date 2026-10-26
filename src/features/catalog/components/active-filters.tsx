"use client";

import { X } from "lucide-react";

import { useI18n } from "@/i18n/i18n-provider";
import { formatRating } from "@/lib/format";

import { getCategory } from "../data/categories";
import { getColor } from "../data/colors";
import type { CatalogFilters } from "../filters";
import { sizeLabel } from "../sizes";

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

export function ActiveFilters({ filters, onChange, onClear }: ActiveFiltersProps) {
  const { locale, t: dictionary } = useI18n();
  const t = dictionary.catalog;
  const chips: Chip[] = [
    ...(filters.query
      ? [{ key: "q", label: t.chipSearch(filters.query), remove: { query: "" } }]
      : []),
    ...filters.categories.map((slug) => ({
      key: `cat-${slug}`,
      label: getCategory(slug, locale).name,
      remove: { categories: filters.categories.filter((item) => item !== slug) },
    })),
    ...filters.colors.map((id) => ({
      key: `color-${id}`,
      label: getColor(id, locale).name,
      remove: { colors: filters.colors.filter((item) => item !== id) },
    })),
    ...filters.sizes.map((size) => ({
      key: `size-${size}`,
      label:
        size === "U"
          ? dictionary.common.oneSize
          : dictionary.common.sizeShort(sizeLabel(size, locale)),
      remove: { sizes: filters.sizes.filter((item) => item !== size) },
    })),
    ...(filters.minPrice !== null || filters.maxPrice !== null
      ? [
          {
            key: "price",
            label: t.priceRange(filters.minPrice, filters.maxPrice),
            remove: { minPrice: null, maxPrice: null },
          },
        ]
      : []),
    ...(filters.minRating !== null
      ? [
          {
            key: "rating",
            label: t.chipRating(formatRating(filters.minRating, locale)),
            remove: { minRating: null },
          },
        ]
      : []),
    ...(filters.onSale ? [{ key: "sale", label: t.chipSale, remove: { onSale: false } }] : []),
  ];

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ul className="flex flex-wrap gap-2" aria-label={t.appliedFilters}>
        {chips.map((chip) => (
          <li key={chip.key}>
            <button
              type="button"
              onClick={() => onChange(chip.remove)}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted py-1.5 pr-2.5 pl-3 text-xs font-medium hover:bg-border"
              aria-label={t.removeFilter(chip.label)}
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
        {t.clearAll}
      </button>
    </div>
  );
}
