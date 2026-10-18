import Image from "next/image";
import Link from "next/link";

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

/**
 * The pitch over the picture that makes it: the Casa Anfa stage — a
 * brand's name on a stage — in front of a full crowd, full bleed. The
 * title sits low on it at display size, the two ways in under it, and the
 * partners run past along the foot of the frame on a yellow band, so the
 * first screen already says who has done this before.
 */
export function SponsorHero() {
  const { eyebrow, title, intro, heroImage, primary, secondary, trustedBy } =
    sponsorCopy;
  const run = [...trustedBy.brands, ...trustedBy.brands];

  return (
    <section className="relative isolate flex min-h-[calc(100svh-var(--header-h,0px))] flex-col justify-end overflow-hidden">
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-bg-primary via-bg-primary/70 to-bg-primary/20"
      />

      <div className="shell flex flex-col gap-7 pb-12 pt-24 xl:pb-16">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          className="display-text max-w-[14ch] text-white"
          data-reveal="clip"
        >
          {title}
        </h1>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <p
            className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-[17px] leading-[26px] text-content-primary"
            data-reveal="up"
          >
            {intro}
          </p>
          <div className="flex flex-wrap items-center gap-3" data-reveal="up">
            <Link
              href={primary.href}
              data-magnetic="0.2"
              className="sweep flex items-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 text-[#0b0b0e] after:!bg-white"
            >
              <span className="relative z-10">{primary.label}</span>
            </Link>
            <Link
              href={secondary.href}
              className="btn-secondary flex items-center border border-white/25 px-5 py-4 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 text-white transition-colors hover:border-white/60"
            >
              {secondary.label}
            </Link>
          </div>
        </div>
      </div>

      {/* They trust us, running past. Names only until each brand approves
          its logo — see `trustedBy` in the data. */}
      <div className="relative flex items-center gap-6 overflow-hidden bg-brand py-4 text-[#0b0b0e]">
        <span className="relative z-10 shrink-0 bg-brand pl-[var(--shell-gutter)] pr-4 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase tracking-[0.16em]">
          {trustedBy.title}
        </span>
        <div aria-hidden className="band-track flex w-max shrink-0 gap-10 whitespace-nowrap font-daltown text-[34px] uppercase leading-none">
          {run.map((brand, i) => (
            <span key={i} className="flex items-center gap-10">
              {brand}
              <span className="block size-2 bg-[#0b0b0e]" />
            </span>
          ))}
        </div>
        <ul className="sr-only">
          {trustedBy.brands.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Stats bar --------------------------------------------------------- */

/**
 * The four numbers at display size, each under a yellow rule, so the
 * scale of the thing reads before any sentence does. Bracketed values
 * stay bracketed until content confirms them.
 */
export function SponsorStats() {
  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        {sponsorCopy.stats.map((stat) => (
          <div
            key={stat.note}
            data-reveal="up"
            className="flex flex-col gap-3 border-t-2 border-brand pt-5"
          >
            <p
              className={`m-0 font-daltown text-[clamp(64px,6.4vw,104px)] uppercase leading-[0.85] ${
                stat.accent ? "text-brand" : "text-white"
              }`}
            >
              {stat.value}
            </p>
            <p className="m-0 max-w-[26ch] font-[family-name:var(--font-display)] text-[14px] leading-5 text-content-secondary">
              {stat.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* They trust us ----------------------------------------------------- */

/**
 * The partners now run along the foot of the hero. This keeps the
 * mockup's note about logos, so the gap it describes stays visible.
 */
export function SponsorTrust() {
  const { note } = sponsorCopy.trustedBy;
  return (
    <section className="relative">
      <div className="shell">
        <p className="m-0 border-l-2 border-brand/60 pl-4 font-[family-name:var(--font-display)] text-[13px] leading-5 text-white/40">
          {note}
        </p>
      </div>
    </section>
  );
}

/* Audience ---------------------------------------------------------- */

/**
 * Who you will reach, over the crowd itself: a wide festival photograph
 * with the four audience figures laid across its foot as one strip of
 * glass panels, so the numbers sit on the people they describe.
 */
export function SponsorAudience() {
  const { eyebrow, title, cards, image } = sponsorCopy.audience;
  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <div className="flex flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="section-title text-white" data-reveal="clip">
            {title}
          </h2>
        </div>

        <div className="relative isolate flex min-h-[520px] flex-col justify-end overflow-hidden" data-reveal="up">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1512px) 1272px, 100vw"
            className="-z-20 object-cover"
          />
          <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className="flex flex-col gap-2 bg-black/55 p-6 backdrop-blur-md"
              >
                <p className="m-0 font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase tracking-[0.14em] text-content-secondary">
                  {card.label}
                </p>
                <p /* No `uppercase`: these are values, not headings, and the
                       mockup's "[XXk]" has a lowercase k that carries meaning. */
                  className="m-0 font-daltown text-[56px] leading-[0.9] text-brand"
                >
                  {card.value}
                </p>
                <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 text-white/60">
                  {card.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
