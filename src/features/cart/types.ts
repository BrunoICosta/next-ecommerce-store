import type { ColorId, Product, Size } from "@/features/catalog";

/**
 * The cart stores references only (id + variant). Names and prices are always
 * read from the catalog, so a stale localStorage never shows an old price.
 */
export interface CartItem {
  /** Unique per product variant: `${productId}:${color}:${size}`. */
  key: string;
  productId: string;
  color: ColorId;
  size: Size;
  quantity: number;
}

export interface CartLine extends CartItem {
  product: Product;
  unitPrice: number;
  lineTotal: number;
}

export type ShippingMethodId = "pac" | "sedex";

export interface ShippingOption {
  id: ShippingMethodId;
  label: string;
  /** Price in cents. 0 means free shipping. */
  price: number;
  minDays: number;
  maxDays: number;
}

export interface Coupon {
  code: string;
  description: string;
  percentOff: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number | null;
  total: number;
}
