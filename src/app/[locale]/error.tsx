"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n-provider";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, routes } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold tracking-widest text-accent uppercase">
        {t.error.eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">{t.error.title}</h1>
      <p className="mt-4 text-muted-foreground">{t.error.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>
          <RotateCcw className="size-4" aria-hidden />
          {t.error.retry}
        </Button>
        <ButtonLink href={routes.home} variant="outline">
          {t.error.home}
        </ButtonLink>
      </div>
    </main>
  );
}
