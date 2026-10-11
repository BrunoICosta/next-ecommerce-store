import { useId, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/cn";

const controlClass =
  "h-11 w-full rounded-xl border bg-card px-3.5 text-sm transition placeholder:text-muted-foreground/70 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none disabled:opacity-60";

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

function FieldShell({ id, label, error, hint, className, children }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

type TextFieldProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: ReactNode;
  containerClassName?: string;
  adornment?: ReactNode;
};

export function TextField({
  label,
  error,
  hint,
  containerClassName,
  adornment,
  id,
  className,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <FieldShell id={inputId} label={label} error={error} hint={hint} className={containerClassName}>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            controlClass,
            error ? "border-danger" : "border-border",
            adornment && "pr-10",
            className,
          )}
          {...props}
        />
        {adornment && (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            {adornment}
          </span>
        )}
      </div>
    </FieldShell>
  );
}

type SelectFieldProps = ComponentProps<"select"> & {
  label: string;
  error?: string;
  hint?: ReactNode;
  containerClassName?: string;
};

export function SelectField({
  label,
  error,
  hint,
  containerClassName,
  id,
  className,
  children,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <FieldShell
      id={selectId}
      label={label}
      error={error}
      hint={hint}
      className={containerClassName}
    >
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={cn(controlClass, error ? "border-danger" : "border-border", className)}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}
