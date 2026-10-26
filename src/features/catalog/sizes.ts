import type { Locale } from "@/i18n/config";

import type { Size } from "./types";

/** Brazilian apparel sizes shown with their usual US/international equivalents. */
const EN_SIZES: Partial<Record<Size, string>> = { PP: "XS", P: "S", M: "M", G: "L", GG: "XL" };

export function sizeLabel(size: Size, locale: Locale): string {
  if (locale === "en") return EN_SIZES[size] ?? size;
  return size;
}
