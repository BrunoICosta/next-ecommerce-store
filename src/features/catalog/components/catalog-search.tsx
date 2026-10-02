"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface CatalogSearchProps {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
}

/** Search box with a local draft, debounced before it reaches the URL. */
export function CatalogSearch({ value, onChange, delay = 300 }: CatalogSearchProps) {
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);

  // Adopt external changes (header search, "clear all") without an effect.
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  useEffect(() => {
    if (draft.trim() === value.trim()) return;
    const timer = window.setTimeout(() => onChange(draft), delay);
    return () => window.clearTimeout(timer);
  }, [draft, value, onChange, delay]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <label htmlFor="catalog-search" className="sr-only">
        Buscar no catálogo
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        id="catalog-search"
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Buscar no catálogo"
        autoComplete="off"
        className="h-10 w-full rounded-full border border-border bg-card pr-9 pl-9 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {draft && (
        <button
          type="button"
          onClick={() => {
            setDraft("");
            onChange("");
          }}
          className="absolute top-1/2 right-2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Limpar busca"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
