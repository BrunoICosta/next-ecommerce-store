"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, type FormEvent } from "react";

import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n/i18n-provider";

interface SearchFormProps {
  className?: string;
  onSubmitted?: () => void;
}

export function SearchForm({ className, onSubmitted }: SearchFormProps) {
  const router = useRouter();
  const { t, routes } = useI18n();
  const inputId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    const query = term ? new URLSearchParams({ q: term }).toString() : undefined;
    router.push(routes.products(query));
    onSubmitted?.();
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={cn("relative", className)}>
      <label htmlFor={inputId} className="sr-only">
        {t.header.searchLabel}
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        id={inputId}
        name="q"
        type="search"
        placeholder={t.header.searchPlaceholder}
        autoComplete="off"
        className="h-10 w-full rounded-full border border-border bg-card pr-4 pl-9 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none"
      />
    </form>
  );
}
