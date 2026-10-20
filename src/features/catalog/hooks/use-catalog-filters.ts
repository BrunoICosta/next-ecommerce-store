"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useOptimistic, useTransition } from "react";

import { DEFAULT_FILTERS, type CatalogFilters } from "../filters";
import { parseFilters, serializeFilters } from "../filters-url";

/**
 * URL-backed filter state. The search params are the source of truth and
 * updates use router.replace so filtering does not flood the history.
 *
 * router.replace runs inside a transition, so the URL (and therefore the
 * parsed filters) only changes once navigation settles. useOptimistic shows
 * the new filters immediately; without it controlled checkboxes and radios
 * would briefly snap back to their previous state.
 */
export function useCatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlFilters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const [filters, setOptimisticFilters] = useOptimistic(urlFilters);

  const setFilters = useCallback(
    (next: CatalogFilters) => {
      const query = serializeFilters(next).toString();
      startTransition(() => {
        setOptimisticFilters(next);
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [router, pathname, setOptimisticFilters],
  );

  const updateFilters = useCallback(
    (patch: Partial<CatalogFilters>) => setFilters({ ...filters, ...patch }),
    [filters, setFilters],
  );

  const clearFilters = useCallback(
    () => setFilters({ ...DEFAULT_FILTERS, sort: filters.sort }),
    [filters.sort, setFilters],
  );

  return { filters, updateFilters, clearFilters, isPending };
}
