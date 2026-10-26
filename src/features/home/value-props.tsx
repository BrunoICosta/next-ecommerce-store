import { CreditCard, RefreshCcw, ShieldCheck, Truck } from "lucide-react";

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const ICONS = [Truck, RefreshCcw, CreditCard, ShieldCheck];

export function ValueProps({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).home;
  return (
    <section aria-label={t.benefits} className="mx-auto max-w-7xl px-4 sm:px-6">
      <ul className="grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
        {t.valueProps.map(({ title, text }, index) => {
          const Icon = ICONS[index];
          return (
            <li key={title} className="flex gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-semibold">{title}</span>
                <span className="text-sm text-muted-foreground">{text}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
