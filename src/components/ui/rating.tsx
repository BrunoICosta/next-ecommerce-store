import { Star } from "lucide-react";

import { cn } from "@/lib/cn";
import { formatRating } from "@/lib/format";

interface RatingProps {
  value: number;
  count?: number;
  className?: string;
}

export function Rating({ value, count, className }: RatingProps) {
  const label = `Avaliação ${formatRating(value)} de 5${count !== undefined ? `, ${count} avaliações` : ""}`;
  return (
    <div
      className={cn("flex items-center gap-1.5 text-sm", className)}
      role="img"
      aria-label={label}
    >
      <span className="flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.max(0, Math.min(1, value - (star - 1)));
          return (
            <span key={star} className="relative size-4">
              <Star
                className="absolute inset-0 size-4 text-border"
                fill="currentColor"
                strokeWidth={0}
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className="size-4 text-star" fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </span>
      <span className="font-medium" aria-hidden>
        {formatRating(value)}
      </span>
      {count !== undefined && (
        <span className="text-muted-foreground" aria-hidden>
          ({count})
        </span>
      )}
    </div>
  );
}
