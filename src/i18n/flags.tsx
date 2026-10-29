import type { Locale } from "./config";

/**
 * Inline SVG flags (emoji flags render as "BR"/"US" letters on Windows).
 * Decorative only: the surrounding control carries the accessible name.
 * Rounded corners come from the wrapper (rounded + overflow-hidden), so no
 * clipPath ids are needed and several instances can live on the same page.
 */
function BrazilFlag() {
  return (
    <svg viewBox="0 0 28 20" width={28} height={20} aria-hidden="true" focusable="false">
      <rect width={28} height={20} fill="#009C3B" />
      <path d="M14 2.5 25.5 10 14 17.5 2.5 10Z" fill="#FFDF00" />
      <circle cx={14} cy={10} r={4.6} fill="#002776" />
      <path d="M9.6 8.9c3-.9 6.3-.6 8.9 1.1l-.3.9c-2.5-1.6-5.6-1.9-8.4-1.1Z" fill="#fff" />
    </svg>
  );
}

const US_STAR_ROWS = [
  [2, 5, 8, 11],
  [3.5, 6.5, 9.5],
  [2, 5, 8, 11],
  [3.5, 6.5, 9.5],
];

function UsaFlag() {
  return (
    <svg viewBox="0 0 28 20" width={28} height={20} aria-hidden="true" focusable="false">
      <rect width={28} height={20} fill="#fff" />
      <path
        d="M0 0h28M0 3.08h28M0 6.15h28M0 9.23h28M0 12.3h28M0 15.38h28M0 18.46h28"
        stroke="#B22234"
        strokeWidth={1.54}
        transform="translate(0 .77)"
      />
      <rect width={12} height={10.77} fill="#3C3B6E" />
      <g fill="#fff">
        {US_STAR_ROWS.flatMap((row, rowIndex) =>
          row.map((cx) => (
            <circle key={`${rowIndex}-${cx}`} cx={cx} cy={2 + rowIndex * 2} r={0.6} />
          )),
        )}
      </g>
    </svg>
  );
}

export function LocaleFlag({ locale }: { locale: Locale }) {
  return (
    <span className="block overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgb(0_0_0/0.12)]">
      {locale === "pt-BR" ? <BrazilFlag /> : <UsaFlag />}
    </span>
  );
}
