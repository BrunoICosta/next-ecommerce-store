import { getProductById, getProductPrice } from "@/features/catalog";
import type { Locale } from "@/i18n/config";

import type {
  CartItem,
  CartLine,
  CartTotals,
  Coupon,
  ShippingMethodId,
  ShippingOption,
} from "./types";

export const MAX_QUANTITY_PER_ITEM = 10;
export const FREE_SHIPPING_THRESHOLD = 29_900;
export const PIX_DISCOUNT_PERCENT = 5;

const COUPONS: Record<string, Coupon> = {
  BEMVINDO10: {
    code: "BEMVINDO10",
    percentOff: 10,
  },
};

export function cartItemKey(productId: string, color: string, size: string): string {
  return `${productId}:${color}:${size}`;
}

export function findCoupon(code: string): Coupon | null {
  return COUPONS[code.trim().toUpperCase()] ?? null;
}

/** Resolves stored items against the catalog, dropping products that no longer exist. */
export function resolveCartLines(items: CartItem[], locale: Locale): CartLine[] {
  return items.flatMap((item) => {
    const product = getProductById(item.productId, locale);
    if (!product) return [];
    return [
      { ...item, product, unitPrice: product.price, lineTotal: product.price * item.quantity },
    ];
  });
}

export function sanitizeCep(value: string): string {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function isValidCep(value: string): boolean {
  const digits = sanitizeCep(value);
  return digits.length === 8 && !/^(\d)\1{7}$/.test(digits);
}

export function formatCep(value: string): string {
  const digits = sanitizeCep(value);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

/**
 * Fake carrier table keyed by the first CEP digit (which maps to a region in
 * Brazil). Good enough to make the demo feel real without any API.
 */
const REGION_RATES: Record<string, { base: number; minDays: number; maxDays: number }> = {
  "0": { base: 1490, minDays: 2, maxDays: 4 }, // Grande São Paulo
  "1": { base: 1690, minDays: 2, maxDays: 5 }, // Interior de SP
  "2": { base: 1890, minDays: 3, maxDays: 5 }, // RJ e ES
  "3": { base: 1990, minDays: 3, maxDays: 6 }, // MG
  "4": { base: 2490, minDays: 5, maxDays: 8 }, // BA e SE
  "5": { base: 2790, minDays: 6, maxDays: 9 }, // PE, AL, PB, RN
  "6": { base: 3290, minDays: 7, maxDays: 12 }, // CE, PI, MA e Norte
  "7": { base: 2290, minDays: 4, maxDays: 7 }, // DF, GO, TO, MT, MS, RO
  "8": { base: 1990, minDays: 3, maxDays: 6 }, // PR e SC
  "9": { base: 2190, minDays: 4, maxDays: 7 }, // RS
};

export function quoteShipping(cep: string, merchandiseTotal: number): ShippingOption[] | null {
  if (!isValidCep(cep)) return null;
  const rate = REGION_RATES[sanitizeCep(cep)[0]];
  const freePac = merchandiseTotal >= FREE_SHIPPING_THRESHOLD;
  return [
    {
      id: "pac",
      price: freePac ? 0 : rate.base,
      minDays: rate.minDays,
      maxDays: rate.maxDays,
    },
    {
      id: "sedex",
      price: Math.round((rate.base * 1.8) / 10) * 10,
      minDays: Math.max(1, Math.ceil(rate.minDays / 2)),
      maxDays: Math.max(2, Math.ceil(rate.maxDays / 2)),
    },
  ];
}

interface TotalsInput {
  items: CartItem[];
  coupon: Coupon | null;
  cep: string | null;
  shippingMethod: ShippingMethodId;
}

export function calculateTotals({ items, coupon, cep, shippingMethod }: TotalsInput): CartTotals {
  // Totals only need prices, which are the same in every language.
  const priced = items.flatMap((item) => {
    const price = getProductPrice(item.productId);
    return price === undefined ? [] : [{ price, quantity: item.quantity }];
  });
  const subtotal = priced.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const itemCount = priced.reduce((sum, line) => sum + line.quantity, 0);
  const discount = coupon ? Math.round((subtotal * coupon.percentOff) / 100) : 0;
  const merchandise = subtotal - discount;

  let shipping: number | null = null;
  if (cep && itemCount > 0) {
    const option = quoteShipping(cep, merchandise)?.find((o) => o.id === shippingMethod);
    shipping = option?.price ?? null;
  }

  return { itemCount, subtotal, discount, shipping, total: merchandise + (shipping ?? 0) };
}

export function amountUntilFreeShipping(merchandiseTotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - merchandiseTotal);
}
