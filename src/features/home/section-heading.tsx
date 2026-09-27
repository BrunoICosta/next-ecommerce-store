import Link from "next/link";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  action?: { href: string; label: string };
}

export function SectionHeading({ id, eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="shrink-0 text-sm font-semibold underline-offset-4 hover:underline"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
