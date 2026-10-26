export type CategorySlug = "camisetas" | "moletons" | "calcas" | "tenis" | "bones" | "mochilas";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export type ColorId =
  "preto" | "branco" | "marinho" | "oliva" | "areia" | "vinho" | "cinza" | "terracota" | "azul";

export interface ColorOption {
  id: ColorId;
  name: string;
  /** Main swatch color. */
  hex: string;
  /** Darker shade used for shadows and details in the product artwork. */
  shade: string;
}

export type ApparelSize = "PP" | "P" | "M" | "G" | "GG";
export type ShoeSize = "37" | "38" | "39" | "40" | "41" | "42" | "43" | "44";
export type Size = ApparelSize | ShoeSize | "U";

/** Translatable marketing copy of a product. */
export interface ProductText {
  name: string;
  tagline: string;
  description: string;
  features: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /** Short marketing line shown on cards. */
  tagline: string;
  description: string;
  features: string[];
  /** Price in cents (BRL) to avoid floating point issues. */
  price: number;
  /** Original price in cents when the product is on sale. */
  compareAtPrice?: number;
  colors: ColorId[];
  sizes: Size[];
  /** Average rating from 0 to 5. */
  rating: number;
  reviewCount: number;
  /** Units sold, used to rank best sellers. */
  soldCount: number;
  /** ISO date used for the "newest" sort. */
  createdAt: string;
}
