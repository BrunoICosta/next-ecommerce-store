"use client";

import { Heart } from "lucide-react";

import { cn } from "@/lib/cn";

import { useWishlistHydrated, useWishlistStore } from "../store";

interface WishlistButtonProps {
  productId: string;
  productName: string;
  variant?: "icon" | "full";
  className?: string;
}

export function WishlistButton({
  productId,
  productName,
  variant = "icon",
  className,
}: WishlistButtonProps) {
  const hydrated = useWishlistHydrated();
  const saved = useWishlistStore((state) => state.productIds.includes(productId));
  const toggle = useWishlistStore((state) => state.toggle);
  const active = hydrated && saved;
  const label = active
    ? `Remover ${productName} dos favoritos`
    : `Adicionar ${productName} aos favoritos`;

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggle(productId)}
        aria-pressed={active}
        aria-label={label}
        className={cn(
          "inline-flex h-13 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition",
          active ? "border-accent text-accent" : "border-border hover:border-foreground",
          className,
        )}
      >
        <Heart className="size-5" fill={active ? "currentColor" : "none"} aria-hidden />
        <span className="hidden sm:inline">{active ? "Salvo" : "Favoritar"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={active}
      aria-label={label}
      title={active ? "Remover dos favoritos" : "Salvar nos favoritos"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition hover:scale-110",
        active ? "text-accent" : "text-foreground",
        className,
      )}
    >
      <Heart className="size-4.5" fill={active ? "currentColor" : "none"} aria-hidden />
    </button>
  );
}
