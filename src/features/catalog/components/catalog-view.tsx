"use client";

import { SearchX, SlidersHorizontal } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/cn";

import { countActiveFilters, filterProducts, SORT_OPTIONS, type SortOption } from "../filters";
import { useCatalogFilters } from "../hooks/use-catalog-filters";
import { getAllProducts, getCategoryCounts } from "../queries";
import { ActiveFilters } from "./active-filters";
import { CatalogSearch } from "./catalog-search";
import { FilterPanel } from "./filter-panel";
import { ProductGrid } from "./product-grid";

const categoryCounts = getCategoryCounts();

export function CatalogView() {
  const { filters, updateFilters, clearFilters, isPending } = useCatalogFilters();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { locale, t: dictionary } = useI18n();
  const t = dictionary.catalog;

  const deferredFilters = useDeferredValue(filters);
  const results = useMemo(
    () => filterProducts(getAllProducts(locale), deferredFilters, locale),
    [deferredFilters, locale],
  );
  const activeCount = countActiveFilters(filters);

  const panel = (
    <FilterPanel filters={filters} categoryCounts={categoryCounts} onChange={updateFilters} />
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden lg:block" aria-label={t.filters}>
        {panel}
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CatalogSearch value={filters.query} onChange={(query) => updateFilters({ query })} />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              {activeCount > 0 ? t.filtersWithCount(activeCount) : t.filters}
            </Button>
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only text-muted-foreground sm:not-sr-only">{t.sortBy}</span>
              <select
                value={filters.sort}
                onChange={(event) => updateFilters({ sort: event.target.value as SortOption })}
                className="h-9 rounded-full border border-border bg-card px-3 text-sm font-medium"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {t.sort[option]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {t.found(results.length)}
          </p>
          <ActiveFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />
        </div>

        {results.length > 0 ? (
          <ProductGrid
            products={results}
            preferredColors={filters.colors}
            locale={locale}
            className={cn("mt-6 transition-opacity", isPending && "opacity-70")}
          />
        ) : (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
            <SearchX className="size-10 text-muted-foreground" aria-hidden />
            <h2 className="mt-4 text-lg font-semibold">{t.emptyTitle}</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t.emptyText}</p>
            <Button className="mt-6" onClick={clearFilters}>
              {t.clearFilters}
            </Button>
          </div>
        )}
      </div>

      <Sheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title={t.filters}
        side="left"
        footer={
          <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>
            {t.showResults(results.length)}
          </Button>
        }
      >
        {panel}
      </Sheet>
    </div>
  );
}
