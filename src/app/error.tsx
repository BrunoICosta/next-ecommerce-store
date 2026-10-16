"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold tracking-widest text-accent uppercase">Algo deu errado</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Não foi possível carregar a página</h1>
      <p className="mt-4 text-muted-foreground">
        Tente novamente. Se o problema continuar, volte para a página inicial.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>
          <RotateCcw className="size-4" aria-hidden />
          Tentar novamente
        </Button>
        <ButtonLink href={routes.home} variant="outline">
          Página inicial
        </ButtonLink>
      </div>
    </main>
  );
}
