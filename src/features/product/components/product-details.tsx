"use client";

import { RefreshCcw, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Rating } from "@/components/ui/rating";
import { useCartStore } from "@/features/cart/store";
import type { ColorId, Product, Size } from "@/features/catalog";
import { getCategory, getDiscountPercent } from "@/features/catalog";
import { formatInstallments } from "@/lib/format";

import { ProductGallery } from "./product-gallery";
import { ColorSelector, SizeSelector } from "./variant-selector";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [color, setColor] = useState<ColorId>(product.colors[0]);
  const [size, setSize] = useState<Size | null>(
    product.sizes.length === 1 ? product.sizes[0] : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState<string | undefined>();
  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const discount = getDiscountPercent(product);

  function handleSizeChange(next: Size) {
    setSize(next);
    setSizeError(undefined);
  }

  function handleAddToCart() {
    if (!size) {
      setSizeError("Selecione um tamanho para continuar.");
      return;
    }
    addItem({ productId: product.id, color, size, quantity });
    setQuantity(1);
    openDrawer();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductGallery name={product.name} category={product.category} color={color} />

      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">
            {getCategory(product.category).name}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-muted-foreground">{product.tagline}</p>
          <Rating value={product.rating} count={product.reviewCount} className="mt-3" />
        </div>

        <div>
          <div className="flex items-center gap-3">
            <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
            {discount > 0 && <Badge tone="accent">-{discount}%</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            ou {formatInstallments(product.price)} · 5% off no Pix
          </p>
        </div>

        <ColorSelector colors={product.colors} value={color} onChange={setColor} />
        <SizeSelector
          sizes={product.sizes}
          value={size}
          onChange={handleSizeChange}
          error={sizeError}
        />

        <div className="flex flex-wrap items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <Button size="lg" className="flex-1" onClick={handleAddToCart}>
            <ShoppingBag className="size-5" aria-hidden />
            Adicionar ao carrinho
          </Button>
        </div>

        <ul className="grid gap-3 rounded-2xl border border-border p-4 text-sm sm:grid-cols-2">
          <li className="flex gap-3">
            <Truck className="size-5 shrink-0 text-accent" aria-hidden />
            <span>
              <strong className="block">Frete grátis acima de R$ 299</strong>
              <span className="text-muted-foreground">Calcule o prazo no carrinho.</span>
            </span>
          </li>
          <li className="flex gap-3">
            <RefreshCcw className="size-5 shrink-0 text-accent" aria-hidden />
            <span>
              <strong className="block">Troca grátis</strong>
              <span className="text-muted-foreground">Em até 30 dias após o recebimento.</span>
            </span>
          </li>
        </ul>

        <section aria-labelledby="descricao">
          <h2 id="descricao" className="text-lg font-semibold">
            Sobre o produto
          </h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">{product.description}</p>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
