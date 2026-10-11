import Link from "next/link";

import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { sponsorCopy } from "@/data/sponsor";

/* Shared bits ------------------------------------------------------- */

const EYEBROW =
  "m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className={EYEBROW} data-reveal="up">
      {children}
    </p>
  );
}

/* Hero -------------------------------------------------------------- */

export function SponsorHero() {
  const { eyebrow, title, intro, heroPhoto, primary, secondary } = sponsorCopy;
  return (
    <section className="relative">
      <div className="shell grid gap-10 pb-12 pt-6 xl:grid-cols-[1fr_minmax(0,420px)] xl:gap-16 xl:pt-16">
        <div className="flex flex-col gap-7">
          <Eyebrow>{eyebrow}</Eyebrow>
          <DisplayHeading as="h1" align="left" reveal="clip">
            {title}
          </DisplayHeading>
          <p
            className="m-0 max-w-[560px] font-[family-name:var(--font-ui)] text-[17px] leading-[1.7] text-content-secondary"
            data-split="lines"
            data-reveal-delay="0.1"
          >
            {intro}
          </p>
          <div className="flex flex-wrap items-center gap-3" data-reveal="up">
            <Link
              href={primary.href}
              data-magnetic="0.2"
              className="sweep flex items-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-[#0b0b0e]"
            >
              <span className="relative z-10">{primary.label}</span>
            </Link>
            <Link
              href={secondary.href}
              className="btn-secondary flex items-center border border-white/25 px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-white transition-colors hover:border-white/60"
            >
              {secondary.label}
            </Link>
          </div>
        </div>

        <PhotoSlot
          caption={heroPhoto}
          className="min-h-[280px] w-full xl:min-h-[420px]"
        />
      </div>
    </section>
  );
}

/* Stats bar --------------------------------------------------------- */

export function SponsorStats() {
  return (
    <section className="relative border-y border-white/10 bg-ink-900">
      <div className="shell grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 xl:grid-cols-4 xl:py-12">
        {sponsorCopy.stats.map((stat) => (
          <div key={stat.note} data-reveal="up" className="flex flex-col gap-1">
            <p
              className={`m-0 font-[family-name:var(--font-display)] text-[34px] font-black uppercase leading-[1] tracking-[-0.01em] sm:text-[40px] ${
                stat.accent ? "text-brand" : "text-white"
              }`}
            >
              {stat.value}
            </p>
            <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.5] text-content-secondary">
              {stat.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* They trust us ----------------------------------------------------- */

export function SponsorTrust() {
  const { title, note, brands } = sponsorCopy.trustedBy;
  return (
    <section className="relative border-b border-white/10 py-10 xl:py-12">
      <div className="shell flex flex-col gap-6">
        <p
          className="m-0 font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase leading-4 tracking-[1.56px] text-white/45"
          data-reveal="up"
        >
          {title}
        </p>
        <ul
          className="m-0 flex list-none flex-wrap gap-x-10 gap-y-4 p-0"
          data-reveal="up"
        >
          {brands.map((brand) => (
            <li
              key={brand}
              className="font-[family-name:var(--font-display)] text-[20px] font-bold leading-7 text-white sm:text-[22px]"
            >
              {brand}
            </li>
          ))}
        </ul>
        <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/35">
          {note}
        </p>
      </div>
    </section>
  );
}

/* Audience ---------------------------------------------------------- */

export function SponsorAudience() {
  const { eyebrow, title, cards } = sponsorCopy.audience;
  return (
    <section className="relative py-14 xl:py-20">
      <div className="shell flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              data-reveal="up"
              className="flex flex-col gap-2 border border-white/10 bg-ink-900 p-6"
              style={{ borderRadius: "var(--radius)" }}
            >
              <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-5 text-content-secondary">
                {card.label}
              </p>
              <p /* No `uppercase`: these are values, not headings, and the mockup's
                     "[XXk]" has a lowercase k that carries meaning. */
                className="m-0 font-[family-name:var(--font-display)] text-[30px] font-black leading-[1] tracking-[-0.01em] text-brand">
                {card.value}
              </p>
              <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-5 text-white/45">
                {card.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
