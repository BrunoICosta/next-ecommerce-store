"use client";

import { Check } from "lucide-react";
import { useId, type FormEvent, type ReactNode } from "react";

import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/cn";
import { formatRating } from "@/lib/format";

import { getCategories } from "../data/categories";
import { getColors } from "../data/colors";
import { RATING_OPTIONS, SIZE_ORDER, toggleValue, type CatalogFilters } from "../filters";
import { sizeLabel } from "../sizes";
import type { CategorySlug } from "../types";

interface FilterPanelProps {
  filters: CatalogFilters;
  categoryCounts: Record<CategorySlug, number>;
  onChange: (patch: Partial<CatalogFilters>) => void;
}

const PRICE_PRESETS: { min: number | null; max: number | null }[] = [
  { min: null, max: 100 },
  { min: 100, max: 250 },
  { min: 250, max: 400 },
  { min: 400, max: null },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-border pb-6">
      <legend className="mb-3 text-sm font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

function parsePrice(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : null;
}

export function FilterPanel({ filters, categoryCounts, onChange }: FilterPanelProps) {
  // The panel renders twice (desktop sidebar + mobile sheet); radio groups need unique names.
  const ratingGroup = useId();
  const { locale, t: dictionary } = useI18n();
  const t = dictionary.catalog;

  function handlePriceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let min = parsePrice(data.get("min"));
    let max = parsePrice(data.get("max"));
    if (min !== null && max !== null && min > max) [min, max] = [max, min];
    onChange({ minPrice: min, maxPrice: max });
  }

  return (
    <div className="flex flex-col gap-6">
      <Section title={t.categories}>
        <ul className="space-y-2">
          {getCategories(locale).map((category) => {
            const checked = filters.categories.includes(category.slug);
            return (
              <li key={category.slug}>
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      onChange({ categories: toggleValue(filters.categories, category.slug) })
                    }
                    className="size-4 rounded accent-accent"
                  />
                  <span className="flex-1">{category.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {categoryCounts[category.slug]}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title={t.price}>
        <div className="flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset, index) => {
            const label = t.pricePresets[index];
            const active = filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange(
                    active
                      ? { minPrice: null, maxPrice: null }
                      : { minPrice: preset.min, maxPrice: preset.max },
                  )
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
        <form
          key={`${filters.minPrice}-${filters.maxPrice}`}
          onSubmit={handlePriceSubmit}
          className="mt-4 flex items-end gap-2"
        >
          <label className="flex-1 text-xs text-muted-foreground">
            {t.priceMin}
            <input
              name="min"
              inputMode="numeric"
              defaultValue={filters.minPrice ?? ""}
              placeholder="0"
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground"
            />
          </label>
          <label className="flex-1 text-xs text-muted-foreground">
            {t.priceMax}
            <input
              name="max"
              inputMode="numeric"
              defaultValue={filters.maxPrice ?? ""}
              placeholder="600"
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground"
            />
          </label>
          <button
            type="submit"
            className="h-10 rounded-lg bg-foreground px-3 text-sm font-semibold text-background"
          >
            {t.apply}
          </button>
        </form>
      </Section>

      <Section title={t.colors}>
        <ul className="flex flex-wrap gap-2.5">
          {getColors(locale).map((color) => {
            const active = filters.colors.includes(color.id);
            return (
              <li key={color.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  aria-label={color.name}
                  title={color.name}
                  onClick={() => onChange({ colors: toggleValue(filters.colors, color.id) })}
                  className={cn(
                    "relative flex size-9 items-center justify-center rounded-full border border-border ring-offset-2 ring-offset-background transition",
                    active ? "ring-2 ring-foreground" : "hover:ring-2 hover:ring-border",
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {active && (
                    <Check
                      className="size-4 drop-shadow"
                      color={color.id === "branco" || color.id === "areia" ? "#1c1917" : "#fff"}
                      aria-hidden
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title={t.sizes}>
        <ul className="grid grid-cols-5 gap-2">
          {SIZE_ORDER.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <li key={size}>
                <button
                  type="button"
                  aria-pressed={active}
                  aria-label={
                    size === "U"
                      ? dictionary.common.oneSize
                      : dictionary.product.sizeAria(sizeLabel(size, locale))
                  }
                  onClick={() => onChange({ sizes: toggleValue(filters.sizes, size) })}
                  className={cn(
                    "h-9 w-full rounded-lg border text-xs font-semibold transition",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground",
                  )}
                >
                  {size === "U" ? "U" : sizeLabel(size, locale)}
                </button>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title={t.rating}>
        <ul className="space-y-2 text-sm">
          {[...RATING_OPTIONS, null].map((rating) => (
            <li key={rating ?? "all"}>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name={ratingGroup}
                  checked={filters.minRating === rating}
                  onChange={() => onChange({ minRating: rating })}
                  className="size-4 accent-accent"
                />
                {rating === null ? t.ratingAll : t.ratingAtLeast(formatRating(rating, locale))}
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
        <input
          type="checkbox"
          checked={filters.onSale}
          onChange={(event) => onChange({ onSale: event.target.checked })}
          className="size-4 accent-accent"
        />
        {t.onlySale}
      </label>
    </div>
  );
}
