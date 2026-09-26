import Link from "next/link";

import { categories } from "@/features/catalog";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Peças casuais feitas para durar. Esta é uma loja de demonstração criada para portfólio:
            nenhum pedido é processado e nenhum dado sai do seu navegador.
          </p>
        </div>
        <nav aria-label="Categorias no rodapé">
          <h2 className="text-sm font-semibold">Categorias</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={routes.category(category.slug)} className="hover:text-foreground">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold">Atendimento</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Troca grátis em até 30 dias</li>
            <li>Pagamento com cartão, Pix ou boleto</li>
            <li>
              <a
                href={siteConfig.repository}
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                Código-fonte no GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          © 2026 {siteConfig.name}. Desenvolvido por{" "}
          <a
            href={siteConfig.author.url}
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            {siteConfig.author.name}
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
