import type { Category, CategorySlug } from "../types";

export const categories: Category[] = [
  {
    slug: "camisetas",
    name: "Camisetas",
    description: "Algodão macio, caimento certo e cores que combinam com tudo.",
  },
  {
    slug: "moletons",
    name: "Moletons",
    description: "Peças felpadas e jaquetas leves para os dias de vento.",
  },
  {
    slug: "calcas",
    name: "Calças e bermudas",
    description: "Do chino ao jogger: conforto para o dia inteiro.",
  },
  {
    slug: "tenis",
    name: "Tênis",
    description: "Pisada leve para a cidade, a trilha e o treino.",
  },
  {
    slug: "bones",
    name: "Bonés e gorros",
    description: "O detalhe que fecha o visual, faça sol ou frio.",
  },
  {
    slug: "mochilas",
    name: "Mochilas e bolsas",
    description: "Organização e resistência para levar o essencial.",
  },
];

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

export function getCategory(slug: CategorySlug): Category {
  const category = categoryBySlug.get(slug);
  if (!category) throw new Error(`Unknown category: ${slug}`);
  return category;
}

export function isCategorySlug(value: string): value is CategorySlug {
  return categoryBySlug.has(value as CategorySlug);
}
