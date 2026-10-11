import Link from "next/link";

/**
 * A bar across the top of each hospitality direction, so the three can be
 * flipped between without going back to an index.
 *
 * Preview furniture. It belongs to `/preview/*` only and goes when a
 * direction is chosen.
 */

export const HOSPITALITY_VARIANTS = [
  {
    slug: "hospitality-passes",
    label: "A · Passes",
    note: "Each package as a physical pass, price torn off behind a perforation.",
  },
  {
    slug: "hospitality-index",
    label: "B · Index",
    note: "Ruled rows at display size, one picture following the cursor.",
  },
  {
    slug: "hospitality-pill",
    label: "C · Pill",
    note: "The hero's window cut through every package name.",
  },
];

export function VariantBar({ current }: { current: string }) {
  const here = HOSPITALITY_VARIANTS.find((v) => v.slug === current);

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0e]/92 backdrop-blur">
      <div className="shell flex flex-col gap-2 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase leading-4 tracking-[1.56px] text-white/40">
            Direction
          </span>
          {HOSPITALITY_VARIANTS.map((variant) => {
            const on = variant.slug === current;
            return (
              <Link
                key={variant.slug}
                href={`/preview/${variant.slug}`}
                aria-current={on ? "page" : undefined}
                className={`border px-3 py-1.5 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 transition-colors ${
                  on
                    ? "border-brand bg-brand text-[#18181b]"
                    : "border-white/20 text-white/75 hover:border-white/50"
                }`}
              >
                {variant.label}
              </Link>
            );
          })}
          <Link
            href="/hospitality"
            className="border border-white/20 px-3 py-1.5 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 text-white/75 transition-colors hover:border-white/50"
          >
            Current
          </Link>
        </div>

        {here ? (
          <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
            {here.note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
