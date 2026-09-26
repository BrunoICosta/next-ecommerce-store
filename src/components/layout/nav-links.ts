import { routes } from "@/lib/routes";

export const navLinks = [
  { href: routes.products(), label: "Todos os produtos" },
  { href: routes.category("camisetas"), label: "Camisetas" },
  { href: routes.category("moletons"), label: "Moletons" },
  { href: routes.category("tenis"), label: "Tênis" },
  { href: routes.products("ofertas=1"), label: "Ofertas" },
] as const;
