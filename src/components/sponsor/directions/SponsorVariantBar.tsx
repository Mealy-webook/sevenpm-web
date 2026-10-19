import Link from "next/link";

/**
 * A bar across the top of each Become a sponsor direction, so the three can
 * be flipped between. Preview furniture — `/preview/sponsor-*` only, and it
 * goes when a direction is chosen. Every direction keeps the enquiry form
 * off the page and opens it as a pop-up from its calls to action.
 */
export const SPONSOR_VARIANTS = [
  {
    slug: "sponsor-billboard",
    label: "A · Billboard",
    note: "Type at poster scale: the pitch, the numbers and the partners as one loud wall.",
  },
  {
    slug: "sponsor-stage",
    label: "B · Stage",
    note: "A cinematic scroll: one full-screen photograph changing with each chapter.",
  },
  {
    slug: "sponsor-deck",
    label: "C · Deck",
    note: "The partnership deck itself: numbered slides with a progress rail.",
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
