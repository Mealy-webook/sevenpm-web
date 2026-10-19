import Link from "next/link";

/**
 * A bar across the top of each Become a sponsor direction, so the three can
 * be flipped between. (A–F were rejected and removed; these follow the
 * benchmark's brief.) Preview furniture — `/preview/sponsor-*` only, and it
 * goes when a direction is chosen. Every direction keeps the enquiry form
 * off the page and opens it as a pop-up from its calls to action.
 */
export const SPONSOR_VARIANTS = [
  {
    slug: "sponsor-pass",
    label: "J · Backstage pass",
    note: "Sponsorship as access: a pass on a lanyard waiting for your logo, the five formats as five passes.",
  },
  {
    slug: "sponsor-plan",
    label: "K · Site plan",
    note: "The festival ground as a plan — point at an area to see which format puts your brand there. Audience pinned on the crowd, the report you get back.",
  },
  {
    slug: "sponsor-magazine",
    label: "L · Magazine",
    note: "The partnership issue: a cover with the numbers as cover lines, a contents page of formats, each case study as a spread.",
  },
];

export function SponsorVariantBar({ current }: { current: string }) {
  const now = SPONSOR_VARIANTS.find((v) => v.slug === current);
  return (
    <nav aria-label="Directions" className="sticky top-0 z-40 border-b border-white/10 bg-bg-primary/90 backdrop-blur">
      <div className="shell flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
        <ul className="m-0 flex list-none gap-2 p-0">
          {SPONSOR_VARIANTS.map((v) => (
            <li key={v.slug}>
              <Link
                href={`/preview/${v.slug}`}
                aria-current={v.slug === current ? "page" : undefined}
                className={`block whitespace-nowrap border px-4 py-2 font-[family-name:var(--font-display)] text-body-s font-semibold ${v.slug === current ? "border-brand bg-brand text-[#0b0b0e]" : "border-white/15 text-text-primary hover:border-white/40"}`}
              >
                {v.label}
              </Link>
            </li>
          ))}
        </ul>
        {now ? (
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-text-secondary">{now.note}</p>
        ) : null}
      </div>
    </nav>
  );
}
