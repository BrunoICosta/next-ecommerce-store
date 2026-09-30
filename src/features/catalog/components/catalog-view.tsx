"use client";

import { SearchX, SlidersHorizontal } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { pluralize } from "@/lib/format";

import {
  countActiveFilters,
  DEFAULT_FILTERS,
  filterProducts,
  SORT_OPTIONS,
  type CatalogFilters,
  type SortOption,
} from "../filters";
import { getAllProducts, getCategoryCounts } from "../queries";
import { ActiveFilters } from "./active-filters";
import { FilterPanel } from "./filter-panel";
import { ProductGrid } from "./product-grid";

const allProducts = getAllProducts();
const categoryCounts = getCategoryCounts();

export function CatalogView() {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const updateFilters = (patch: Partial<CatalogFilters>) =>
    setFilters((current) => ({ ...current, ...patch }));
  const clearFilters = () => setFilters({ ...DEFAULT_FILTERS, sort: filters.sort });

  const deferredFilters = useDeferredValue(filters);
  const results = useMemo(() => filterProducts(allProducts, deferredFilters), [deferredFilters]);
  const activeCount = countActiveFilters(filters);

  const panel = (
    <FilterPanel filters={filters} categoryCounts={categoryCounts} onChange={updateFilters} />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block" aria-label="Filtros">
        {panel}
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {pluralize(results.length, "produto encontrado", "produtos encontrados")}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filtros{activeCount > 0 && ` (${activeCount})`}
            </Button>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Ordenar por</span>
              <select
                value={filters.sort}
                onChange={(event) => updateFilters({ sort: event.target.value as SortOption })}
                className="h-9 rounded-full border border-border bg-card px-3 text-sm font-medium"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <ActiveFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />
        </div>

        {results.length > 0 ? (
          <ProductGrid products={results} className="mt-6" />
        ) : (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
            <SearchX className="size-10 text-muted-foreground" aria-hidden />
            <h2 className="mt-4 text-lg font-semibold">Nenhum produto encontrado</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Tente remover alguns filtros ou buscar por outro termo.
            </p>
            <Button className="mt-6" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      <Sheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filtros"
        side="left"
        footer={
          <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>
            Ver {pluralize(results.length, "produto", "produtos")}
          </Button>
        }
      >
        {panel}
      </Sheet>
    </div>
  );
}
