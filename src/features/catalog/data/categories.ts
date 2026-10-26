import type { Locale } from "@/i18n/config";

import type { Category, CategorySlug } from "../types";

type CategoryText = Omit<Category, "slug">;

const CATEGORY_TEXT: Record<CategorySlug, Record<Locale, CategoryText>> = {
  camisetas: {
    "pt-BR": {
      name: "Camisetas",
      description: "Algodão macio, caimento certo e cores que combinam com tudo.",
    },
    en: {
      name: "T-shirts",
      description: "Soft cotton, the right fit and colors that go with everything.",
    },
  },
  moletons: {
    "pt-BR": {
      name: "Moletons",
      description: "Peças felpadas e jaquetas leves para os dias de vento.",
    },
    en: { name: "Sweatshirts", description: "Brushed fleece and light jackets for windy days." },
  },
  calcas: {
    "pt-BR": {
      name: "Calças e bermudas",
      description: "Do chino ao jogger: conforto para o dia inteiro.",
    },
    en: { name: "Pants and shorts", description: "From chinos to joggers: all-day comfort." },
  },
  tenis: {
    "pt-BR": { name: "Tênis", description: "Pisada leve para a cidade, a trilha e o treino." },
    en: { name: "Sneakers", description: "A light step for the city, the trail and the gym." },
  },
  bones: {
    "pt-BR": {
      name: "Bonés e gorros",
      description: "O detalhe que fecha o visual, faça sol ou frio.",
    },
    en: { name: "Caps and beanies", description: "The finishing touch, rain or shine." },
  },
  mochilas: {
    "pt-BR": {
      name: "Mochilas e bolsas",
      description: "Organização e resistência para levar o essencial.",
    },
    en: { name: "Backpacks and bags", description: "Tough, organized carry for the essentials." },
  },
};

export const categorySlugs = Object.keys(CATEGORY_TEXT) as CategorySlug[];

export function getCategory(slug: CategorySlug, locale: Locale): Category {
  const text = CATEGORY_TEXT[slug]?.[locale];
  if (!text) throw new Error(`Unknown category: ${slug}`);
  return { slug, ...text };
}

export function getCategories(locale: Locale): Category[] {
  return categorySlugs.map((slug) => getCategory(slug, locale));
}

export function isCategorySlug(value: string): value is CategorySlug {
  return Object.hasOwn(CATEGORY_TEXT, value);
}
