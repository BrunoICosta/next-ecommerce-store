import type { Metadata } from "next";

import { WishlistView } from "@/features/wishlist/components/wishlist-view";
import { resolveLocale } from "@/i18n/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/favoritos">): Promise<Metadata> {
  const { t } = await resolveLocale(params);
  return { title: t.meta.wishlistTitle, robots: { index: false } };
}

export default async function WishlistPage({ params }: PageProps<"/[locale]/favoritos">) {
  const { t } = await resolveLocale(params);
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">{t.wishlist.title}</h1>
      <WishlistView />
    </main>
  );
}
