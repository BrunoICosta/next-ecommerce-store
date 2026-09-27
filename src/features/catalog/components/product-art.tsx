import type { ReactNode } from "react";

import { getColor } from "../data/colors";
import type { CategorySlug, ColorId } from "../types";

export type ArtView = 0 | 1 | 2;

interface Palette {
  fill: string;
  shade: string;
}

const BACKGROUNDS: Record<ArtView, string> = {
  0: "#efebe4",
  1: "#e7ebef",
  2: "#ece7ee",
};

function Tshirt({ fill, shade }: Palette) {
  return (
    <g strokeLinejoin="round">
      <path
        d="M140 110 L98 126 L48 178 L86 222 L120 196 L120 402 L280 402 L280 196 L314 222 L352 178 L302 126 L260 110 Q200 152 140 110 Z"
        fill={fill}
        stroke={shade}
        strokeWidth={3}
      />
      <path d="M140 110 Q200 152 260 110" fill="none" stroke={shade} strokeWidth={7} />
      <path d="M120 196 L120 230 M280 196 L280 230" stroke={shade} strokeWidth={2} opacity={0.5} />
      <path d="M150 380 L250 380" stroke={shade} strokeWidth={2} opacity={0.35} />
    </g>
  );
}

function Hoodie({ fill, shade }: Palette) {
  return (
    <g strokeLinejoin="round">
      <path
        d="M132 122 L92 142 L60 262 L58 382 L96 388 L112 236 L112 404 L288 404 L288 236 L304 388 L342 382 L340 262 L308 142 L268 122 Z"
        fill={fill}
        stroke={shade}
        strokeWidth={3}
      />
      <path d="M146 126 Q200 52 254 126 Q200 166 146 126 Z" fill={shade} opacity={0.85} />
      <path d="M150 318 L250 318 L266 382 L134 382 Z" fill={shade} opacity={0.45} />
      <path d="M186 150 L182 214 M214 150 L218 214" stroke="#f4f2ee" strokeWidth={3} />
      <path d="M112 386 L288 386" stroke={shade} strokeWidth={6} opacity={0.6} />
    </g>
  );
}

function Pants({ fill, shade }: Palette) {
  return (
    <g strokeLinejoin="round">
      <path
        d="M130 92 L270 92 L288 412 L216 412 L200 196 L184 412 L112 412 Z"
        fill={fill}
        stroke={shade}
        strokeWidth={3}
      />
      <rect x={130} y={92} width={140} height={22} fill={shade} opacity={0.6} />
      <path
        d="M142 114 Q150 150 186 150 M258 114 Q250 150 214 150"
        fill="none"
        stroke={shade}
        strokeWidth={3}
      />
      <path d="M200 114 L200 196" stroke={shade} strokeWidth={2} opacity={0.6} />
      <path d="M116 396 L184 396 M216 396 L286 396" stroke={shade} strokeWidth={3} opacity={0.5} />
    </g>
  );
}

function Sneaker({ fill, shade }: Palette) {
  return (
    <g strokeLinejoin="round">
      <path
        d="M58 322 Q56 352 84 354 L328 354 Q354 352 352 322 Z"
        fill="#f7f6f3"
        stroke="#c9c5bc"
        strokeWidth={3}
      />
      <path
        d="M70 322 Q64 252 118 236 L176 216 Q214 204 238 236 L276 270 Q334 280 344 322 Z"
        fill={fill}
        stroke={shade}
        strokeWidth={3}
      />
      <path
        d="M150 226 L190 270 M168 220 L206 262 M186 214 L222 254"
        stroke="#f7f6f3"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path d="M70 300 Q190 290 344 306" fill="none" stroke={shade} strokeWidth={3} opacity={0.6} />
      <path d="M76 254 Q90 238 112 238 L114 290 L74 296 Z" fill={shade} opacity={0.55} />
    </g>
  );
}

function Cap({ fill, shade }: Palette) {
  return (
    <g strokeLinejoin="round">
      <path
        d="M112 292 Q60 300 40 326 Q160 334 320 292 Z"
        fill={shade}
        stroke={shade}
        strokeWidth={3}
      />
      <path
        d="M112 292 Q110 172 220 166 Q322 172 320 292 Z"
        fill={fill}
        stroke={shade}
        strokeWidth={3}
      />
      <path
        d="M220 166 Q200 220 196 292 M220 166 Q262 220 270 292"
        fill="none"
        stroke={shade}
        strokeWidth={2}
        opacity={0.55}
      />
      <circle cx={220} cy={167} r={8} fill={shade} />
      <rect x={180} y={226} width={46} height={26} rx={6} fill="#f4f2ee" opacity={0.85} />
    </g>
  );
}

function Backpack({ fill, shade }: Palette) {
  return (
    <g strokeLinejoin="round">
      <path
        d="M168 132 Q168 92 200 92 Q232 92 232 132"
        fill="none"
        stroke={shade}
        strokeWidth={10}
      />
      <rect
        x={118}
        y={128}
        width={164}
        height={270}
        rx={44}
        fill={fill}
        stroke={shade}
        strokeWidth={3}
      />
      <path
        d="M126 200 Q200 182 274 200"
        fill="none"
        stroke={shade}
        strokeWidth={3}
        opacity={0.7}
      />
      <rect x={144} y={268} width={112} height={96} rx={20} fill={shade} opacity={0.4} />
      <path d="M160 286 L240 286" stroke="#f4f2ee" strokeWidth={3} strokeLinecap="round" />
      <rect x={192} y={278} width={16} height={16} rx={3} fill="#f4f2ee" />
    </g>
  );
}

const SILHOUETTES: Record<CategorySlug, (palette: Palette) => ReactNode> = {
  camisetas: Tshirt,
  moletons: Hoodie,
  calcas: Pants,
  tenis: Sneaker,
  bones: Cap,
  mochilas: Backpack,
};

interface ProductArtProps {
  category: CategorySlug;
  color: ColorId;
  /** 0 = front, 1 = close-up detail, 2 = lifestyle composition. */
  view?: ArtView;
  /** Accessible description. Pass an empty string for purely decorative usage. */
  label: string;
  className?: string;
}

/**
 * Generated vector artwork used as product photography. It is rendered inline
 * so the demo has no external image dependency, ships no image requests and
 * re-tints instantly when the shopper picks another color.
 */
export function ProductArt({ category, color, view = 0, label, className }: ProductArtProps) {
  const { hex, shade } = getColor(color);
  const Silhouette = SILHOUETTES[category];
  const transform =
    view === 1
      ? "translate(-90 -105) scale(1.45)"
      : view === 2
        ? "translate(40 70) scale(0.8) rotate(-8 200 250)"
        : undefined;

  return (
    <svg
      viewBox="0 0 400 500"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width={400} height={500} fill={BACKGROUNDS[view]} />
      {view === 2 && (
        <>
          <circle cx={300} cy={120} r={150} fill={hex} opacity={0.18} />
          <rect x={0} y={400} width={400} height={100} fill={shade} opacity={0.12} />
        </>
      )}
      {view !== 1 && <ellipse cx={200} cy={438} rx={130} ry={14} fill="#000" opacity={0.08} />}
      <g transform={transform}>{Silhouette({ fill: hex, shade })}</g>
    </svg>
  );
}
