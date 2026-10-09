"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

import { routes } from "@/lib/routes";

import { useWishlistHydrated, useWishlistStore } from "../store";

export function WishlistLink() {
  const hydrated = useWishlistHydrated();
  const count = useWishlistStore((state) => state.productIds.length);
  const visibleCount = hydrated ? count : 0;

  return (
    <Link
      href={routes.wishlist}
      className="relative inline-flex size-10 items-center justify-center rounded-full hover:bg-muted"
      aria-label={visibleCount > 0 ? `Favoritos, ${visibleCount} produtos` : "Favoritos"}
    >
      <Heart className="size-5" aria-hidden />
      {visibleCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-bold text-background">
          {visibleCount}
        </span>
      )}
    </Link>
  );
}
