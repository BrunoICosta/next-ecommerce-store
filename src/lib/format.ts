import { defaultLocale, intlLocale, type Locale } from "@/i18n/config";

const currencyFormatters = new Map<Locale, Intl.NumberFormat>();

/**
 * Formats a value in cents as BRL using the active locale:
 * 12990 -> "R$ 129,90" (pt-BR) or "R$129.90" (en). The currency never changes.
 */
export function formatPrice(cents: number, locale: Locale = defaultLocale): string {
  let formatter = currencyFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(intlLocale[locale], { style: "currency", currency: "BRL" });
    currencyFormatters.set(locale, formatter);
  }
  return formatter.format(cents / 100);
}

export function formatRating(rating: number, locale: Locale = defaultLocale): string {
  return rating.toLocaleString(intlLocale[locale], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function formatDate(
  value: Date | string,
  locale: Locale = defaultLocale,
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
): string {
  return new Intl.DateTimeFormat(intlLocale[locale], options).format(new Date(value));
}

/** Number of interest-free installments offered for an amount (min. R$ 20 each). */
export function maxInstallments(cents: number, max = 6, minInstallment = 2000): number {
  return Math.max(1, Math.min(max, Math.floor(cents / minInstallment)));
}
