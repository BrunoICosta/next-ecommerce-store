"use client";

import type { ColorId, Size } from "@/features/catalog";
import { getColor, sizeLabel } from "@/features/catalog";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/cn";

interface ColorSelectorProps {
  colors: ColorId[];
  value: ColorId;
  onChange: (color: ColorId) => void;
}

export function ColorSelector({ colors, value, onChange }: ColorSelectorProps) {
  const { locale, t } = useI18n();
  return (
    <fieldset>
      <legend className="text-sm font-semibold">
        {t.product.color}:{" "}
        <span className="font-normal text-muted-foreground">{getColor(value, locale).name}</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-3">
        {colors.map((colorId) => {
          const color = getColor(colorId, locale);
          const checked = colorId === value;
          return (
            <label key={colorId} className="cursor-pointer" title={color.name}>
              <input
                type="radio"
                name="color"
                value={colorId}
                checked={checked}
                onChange={() => onChange(colorId)}
                className="peer sr-only"
              />
              <span className="sr-only">{color.name}</span>
              <span
                aria-hidden
                className={cn(
                  "block size-10 rounded-full border border-border ring-offset-2 ring-offset-background transition peer-focus-visible:ring-2 peer-focus-visible:ring-accent",
                  checked ? "ring-2 ring-foreground" : "hover:ring-2 hover:ring-border",
                )}
                style={{ backgroundColor: color.hex }}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

interface SizeSelectorProps {
  sizes: Size[];
  value: Size | null;
  onChange: (size: Size) => void;
  error?: string;
}

export function SizeSelector({ sizes, value, onChange, error }: SizeSelectorProps) {
  const { locale, t } = useI18n();
  if (sizes.length === 1 && sizes[0] === "U") {
    return <p className="text-sm text-muted-foreground">{t.common.oneSize}</p>;
  }

  return (
    <fieldset aria-describedby={error ? "size-error" : undefined}>
      <legend className="text-sm font-semibold">
        {t.product.size}
        {value && (
          <span className="font-normal text-muted-foreground">: {sizeLabel(value, locale)}</span>
        )}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((size) => {
          const checked = size === value;
          return (
            <label key={size} className="cursor-pointer">
              <input
                type="radio"
                name="size"
                value={size}
                checked={checked}
                onChange={() => onChange(size)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex h-11 min-w-12 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition peer-focus-visible:ring-2 peer-focus-visible:ring-accent",
                  checked
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground",
                )}
              >
                {sizeLabel(size, locale)}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id="size-error" role="alert" className="mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
