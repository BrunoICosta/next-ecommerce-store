import { PIX_DISCOUNT_PERCENT, quoteShipping } from "@/features/cart/pricing";
import type { CartLine, CartTotals, ShippingOption } from "@/features/cart/types";
import type { CategorySlug, ColorId, Size } from "@/features/catalog";

import type { AddressData, CustomerData, PaymentData, PaymentMethod } from "./schemas";
import { detectCardBrand, onlyDigits, type CardBrand } from "./validators";

export const MIN_INSTALLMENT = 2000;

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  category: CategorySlug;
  color: ColorId;
  size: Size;
  quantity: number;
  unitPrice: number;
}

export type OrderPayment =
  | { method: "card"; brand: CardBrand; last4: string; installments: number }
  | { method: "pix"; code: string }
  | { method: "boleto"; line: string; dueDate: string };

export interface Order {
  id: string;
  createdAt: string;
  customer: Pick<CustomerData, "fullName" | "email">;
  address: AddressData;
  shipping: ShippingOption;
  items: OrderItem[];
  totals: CartTotals & { paymentDiscount: number };
  payment: OrderPayment;
}

export function calculatePaymentDiscount(totals: CartTotals, method: PaymentMethod): number {
  if (method !== "pix") return 0;
  return Math.round(((totals.subtotal - totals.discount) * PIX_DISCOUNT_PERCENT) / 100);
}

export function getInstallmentOptions(total: number, max = 6): { count: number; amount: number }[] {
  const allowed = Math.max(1, Math.min(max, Math.floor(total / MIN_INSTALLMENT)));
  return Array.from({ length: allowed }, (_, index) => ({
    count: index + 1,
    amount: Math.ceil(total / (index + 1)),
  }));
}

function randomDigits(length: number, random: () => number): string {
  return Array.from({ length }, () => Math.floor(random() * 10)).join("");
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const weekday = result.getDay();
    if (weekday !== 0 && weekday !== 6) added += 1;
  }
  return result;
}

interface CreateOrderInput {
  lines: CartLine[];
  totals: CartTotals;
  customer: CustomerData;
  address: AddressData;
  payment: PaymentData;
  now?: Date;
  random?: () => number;
}

/** Builds an immutable order snapshot. `now` and `random` are injectable for tests. */
export function createOrder({
  lines,
  totals,
  customer,
  address,
  payment,
  now = new Date(),
  random = Math.random,
}: CreateOrderInput): Order {
  const merchandise = totals.subtotal - totals.discount;
  const shipping = quoteShipping(address.cep, merchandise)?.find(
    (option) => option.id === address.shippingMethod,
  );
  if (!shipping) throw new Error("Shipping option unavailable for the given CEP");

  const paymentDiscount = calculatePaymentDiscount(totals, payment.method);
  const total = merchandise + shipping.price - paymentDiscount;

  let orderPayment: OrderPayment;
  if (payment.method === "card") {
    const digits = onlyDigits(payment.cardNumber);
    orderPayment = {
      method: "card",
      brand: detectCardBrand(digits),
      last4: digits.slice(-4),
      installments: Number(payment.installments),
    };
  } else if (payment.method === "pix") {
    orderPayment = {
      method: "pix",
      code: `00020126580014BR.GOV.BCB.PIX0136trama-demo-${randomDigits(8, random)}5204000053039865406${(total / 100).toFixed(2)}5802BR5905TRAMA6009SAO PAULO6304${randomDigits(4, random)}`,
    };
  } else {
    orderPayment = {
      method: "boleto",
      line: `34191.${randomDigits(5, random)} ${randomDigits(5, random)}.${randomDigits(6, random)} ${randomDigits(5, random)}.${randomDigits(6, random)} 1 ${randomDigits(14, random)}`,
      dueDate: addBusinessDays(now, 3).toISOString(),
    };
  }

  return {
    id: `TR-${randomDigits(6, random)}`,
    createdAt: now.toISOString(),
    customer: { fullName: customer.fullName, email: customer.email },
    address,
    shipping,
    items: lines.map((line) => ({
      productId: line.productId,
      slug: line.product.slug,
      name: line.product.name,
      category: line.product.category,
      color: line.color,
      size: line.size,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
    })),
    totals: { ...totals, shipping: shipping.price, paymentDiscount, total },
    payment: orderPayment,
  };
}
