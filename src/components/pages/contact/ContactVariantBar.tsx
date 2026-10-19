import Link from "next/link";

/**
 * A bar across the top of each Contact option, so the three can be flipped
 * between. Preview furniture — `/preview/contact-*` only; /contact is
 * unchanged until one is chosen.
 */
export const CONTACT_VARIANTS = [
  {
    slug: "contact-festival",
    label: "G · Festival page",
    note: "Like the event page: centred hero and info row, the six lines as the house-rule tiles, the form, then the FAQ.",
  },
  {
    slug: "contact-hospitality",
    label: "H · Hospitality",
    note: "Like the hospitality block: the title beside the six lines as icon rows with their addresses, then the form.",
  },
  {
    slug: "contact-home",
    label: "I · Homepage",
    note: "Like the homepage: SAY HELLO with the photo window in the O, the lines as news rows, then the form.",
  },
];

export function ContactVariantBar({ current }: { current: string }) {
  const now = CONTACT_VARIANTS.find((v) => v.slug === current);
  return (
    <nav aria-label="Options" className="sticky top-0 z-40 border-b border-white/10 bg-bg-primary/90 backdrop-blur">
      <div className="shell flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
        <ul className="m-0 flex list-none gap-2 p-0">
          {CONTACT_VARIANTS.map((v) => (
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
        {now ? <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-text-secondary">{now.note}</p> : null}
      </div>
    </nav>
  );
}
