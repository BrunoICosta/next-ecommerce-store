import { CreditCard, RefreshCcw, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: Truck, title: "Frete grátis", text: "Em compras acima de R$ 299 para todo o Brasil." },
  { icon: RefreshCcw, title: "Troca fácil", text: "Primeira troca grátis em até 30 dias." },
  { icon: CreditCard, title: "Até 6x sem juros", text: "No cartão, ou 5% de desconto no Pix." },
  { icon: ShieldCheck, title: "Compra segura", text: "Seus dados protegidos de ponta a ponta." },
];

export function ValueProps() {
  return (
    <section aria-label="Vantagens" className="mx-auto max-w-7xl px-4 sm:px-6">
      <ul className="grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Icon className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block font-semibold">{title}</span>
              <span className="text-sm text-muted-foreground">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
