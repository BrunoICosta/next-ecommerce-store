"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { DEFAULT_FILTERS, type CatalogFilters } from "../filters";
import { parseFilters, serializeFilters } from "../filters-url";

/**
 * URL-backed filter state. The search params are the single source of truth;
 * updates use router.replace so typing in filters does not flood the history.
 */
export function useCatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const setFilters = useCallback(
    (next: CatalogFilters) => {
      const query = serializeFilters(next).toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const updateFilters = useCallback(
    (patch: Partial<CatalogFilters>) => setFilters({ ...filters, ...patch }),
    [filters, setFilters],
  );

  const clearFilters = useCallback(
    () => setFilters({ ...DEFAULT_FILTERS, sort: filters.sort }),
    [filters.sort, setFilters],
  );

  return { filters, updateFilters, clearFilters };
}
