import type { ColorId, ColorOption } from "../types";

export const colors: ColorOption[] = [
  { id: "preto", name: "Preto", hex: "#1f2328", shade: "#0b0d10" },
  { id: "branco", name: "Branco", hex: "#f4f2ee", shade: "#d6d2ca" },
  { id: "marinho", name: "Azul-marinho", hex: "#243b63", shade: "#16243d" },
  { id: "oliva", name: "Verde-oliva", hex: "#5f6b3a", shade: "#3f4726" },
  { id: "areia", name: "Areia", hex: "#d8c3a0", shade: "#b49f7c" },
  { id: "vinho", name: "Vinho", hex: "#6e2639", shade: "#4a1826" },
  { id: "cinza", name: "Cinza mescla", hex: "#9aa0a6", shade: "#71767c" },
  { id: "terracota", name: "Terracota", hex: "#c0623f", shade: "#8f4529" },
  { id: "azul", name: "Azul royal", hex: "#2f6fd6", shade: "#1f4c96" },
];

const colorById = new Map(colors.map((color) => [color.id, color]));

export function getColor(id: ColorId): ColorOption {
  const color = colorById.get(id);
  if (!color) throw new Error(`Unknown color: ${id}`);
  return color;
}

export function isColorId(value: string): value is ColorId {
  return colorById.has(value as ColorId);
}
