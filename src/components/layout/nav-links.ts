import type { Dictionary } from "@/i18n/dictionaries";
import type { Routes } from "@/lib/routes";

export function getNavLinks(routes: Routes, t: Dictionary["header"]["nav"]) {
  return [
    { href: routes.products(), label: t.all },
    { href: routes.category("camisetas"), label: t.tshirts },
    { href: routes.category("moletons"), label: t.sweatshirts },
    { href: routes.category("tenis"), label: t.sneakers },
    { href: routes.products("ofertas=1"), label: t.sale },
  ];
}
