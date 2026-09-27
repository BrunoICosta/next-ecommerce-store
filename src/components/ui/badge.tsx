import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface BadgeProps {
  children: ReactNode;
  tone?: "accent" | "neutral" | "success";
  className?: string;
}

const tones = {
  accent: "bg-accent text-accent-foreground",
  neutral: "bg-foreground text-background",
  success: "bg-success/15 text-success",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
