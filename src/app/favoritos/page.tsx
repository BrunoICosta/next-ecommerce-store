import type { Metadata } from "next";

import { WishlistView } from "@/features/wishlist/components/wishlist-view";

export const metadata: Metadata = {
  title: "Favoritos",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Favoritos</h1>
      <WishlistView />
    </main>
  );
}
