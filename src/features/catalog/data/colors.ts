import type { Locale } from "@/i18n/config";

import type { ColorId, ColorOption } from "../types";

type Swatch = Omit<ColorOption, "name"> & { name: Record<Locale, string> };

const SWATCHES: Swatch[] = [
  { id: "preto", name: { "pt-BR": "Preto", en: "Black" }, hex: "#1f2328", shade: "#0b0d10" },
  { id: "branco", name: { "pt-BR": "Branco", en: "White" }, hex: "#f4f2ee", shade: "#d6d2ca" },
  {
    id: "marinho",
    name: { "pt-BR": "Azul-marinho", en: "Navy" },
    hex: "#243b63",
    shade: "#16243d",
  },
  { id: "oliva", name: { "pt-BR": "Verde-oliva", en: "Olive" }, hex: "#5f6b3a", shade: "#3f4726" },
  { id: "areia", name: { "pt-BR": "Areia", en: "Sand" }, hex: "#d8c3a0", shade: "#b49f7c" },
  { id: "vinho", name: { "pt-BR": "Vinho", en: "Burgundy" }, hex: "#6e2639", shade: "#4a1826" },
  {
    id: "cinza",
    name: { "pt-BR": "Cinza mescla", en: "Heather gray" },
    hex: "#9aa0a6",
    shade: "#71767c",
  },
  {
    id: "terracota",
    name: { "pt-BR": "Terracota", en: "Terracotta" },
    hex: "#c0623f",
    shade: "#8f4529",
  },
  {
    id: "azul",
    name: { "pt-BR": "Azul royal", en: "Royal blue" },
    hex: "#2f6fd6",
    shade: "#1f4c96",
  },
];

const swatchById = new Map(SWATCHES.map((swatch) => [swatch.id, swatch]));

export const colorIds = SWATCHES.map((swatch) => swatch.id);

export function getColor(id: ColorId, locale: Locale): ColorOption {
  const swatch = swatchById.get(id);
  if (!swatch) throw new Error(`Unknown color: ${id}`);
  return { ...swatch, name: swatch.name[locale] };
}

export function getColors(locale: Locale): ColorOption[] {
  return colorIds.map((id) => getColor(id, locale));
}

/** Visual data only (no label), for artwork that does not depend on the language. */
export function getSwatch(id: ColorId): Pick<ColorOption, "hex" | "shade"> {
  const swatch = swatchById.get(id);
  if (!swatch) throw new Error(`Unknown color: ${id}`);
  return { hex: swatch.hex, shade: swatch.shade };
}

export function isColorId(value: string): value is ColorId {
  return swatchById.has(value as ColorId);
}
