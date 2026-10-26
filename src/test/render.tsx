import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import { I18nProvider } from "@/i18n/i18n-provider";

interface Options extends Omit<RenderOptions, "wrapper"> {
  locale?: Locale;
}

/** Renders inside the same I18nProvider the app layout uses (pt-BR by default). */
export function renderWithI18n(ui: ReactElement, { locale = "pt-BR", ...options }: Options = {}) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <I18nProvider locale={locale}>{children}</I18nProvider>;
  }
  return render(ui, { wrapper: Wrapper, ...options });
}
