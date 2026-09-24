const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formats a value in cents as BRL, e.g. 12990 -> "R$ 129,90". */
export function formatPrice(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

export function formatInstallments(
  cents: number,
  maxInstallments = 6,
  minInstallment = 2000,
): string {
  const installments = Math.max(1, Math.min(maxInstallments, Math.floor(cents / minInstallment)));
  if (installments === 1) return "à vista";
  return `${installments}x de ${formatPrice(Math.ceil(cents / installments))} sem juros`;
}

export function formatRating(rating: number): string {
  return rating.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
