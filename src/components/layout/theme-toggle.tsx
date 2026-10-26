"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { useI18n } from "@/i18n/i18n-provider";
import { getTheme, setTheme, subscribeTheme, type Theme } from "@/lib/theme";

const getServerTheme = (): Theme | null => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const isDark = theme === "dark";
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition hover:bg-muted"
      aria-label={isDark ? t.header.themeToLight : t.header.themeToDark}
      title={isDark ? t.header.themeLight : t.header.themeDark}
    >
      {theme === null ? (
        <span className="size-5" aria-hidden />
      ) : isDark ? (
        <Sun className="size-5" aria-hidden />
      ) : (
        <Moon className="size-5" aria-hidden />
      )}
    </button>
  );
}
