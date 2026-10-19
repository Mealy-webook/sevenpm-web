import Link from "next/link";

/**
 * A bar across the top of each Contact option, so the three can be flipped
 * between. (G–I were too close to existing pages and are removed.) Preview
 * furniture — `/preview/contact-*` only; /contact is
 * unchanged until one is chosen.
 */
export const CONTACT_VARIANTS = [
  {
    slug: "contact-switchboard",
    label: "M · Switchboard",
    note: "Three questions, one screen each: which festival, what about, then the message — with a running ticket showing where it is going.",
  },
  {
    slug: "contact-helpdesk",
    label: "N · Help desk",
    note: "Ask first: search the festival's answers, then “Still need us?” with each line's reply time.",
  },
  {
    slug: "contact-postcard",
    label: "O · Postcard",
    note: "Write us a postcard: message on the left, who it's for on the right, a stamp with the reply time.",
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
