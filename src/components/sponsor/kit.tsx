"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { HeroTerminal } from "@/components/home/HeroTerminal";
import { ScrollRail } from "@/components/event/ScrollRail";
import { SponsorCta } from "@/components/event/SponsorCta";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { jazzablanca } from "@/data/events";
import { homeCopy } from "@/data/home";
import { sponsorCopy } from "@/data/sponsor";
import { SponsorCtaButton } from "./SponsorDialog";

/**
 * The Become a sponsor page, built only from sections the site already has.
 *
 * Each piece here is an existing section's own markup and tokens carrying
 * the sponsor content — the event page's hero, ticket stubs, house-rule
 * tiles, hospitality rail and FAQ; the homepage's mission cards and news
 * rows; the sponsor wall and the taped yellow bill — so whichever option is
 * chosen, the page reads as one of the site's pages rather than a new
 * design. Every call to action opens the enquiry pop-up (SponsorDialog).
 */

const c = sponsorCopy;

/* Buttons, as the site sets them ------------------------------------ */

export function CtaYellow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <SponsorCtaButton
      className={`sweep flex items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e] ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </SponsorCtaButton>
  );
}

const SECONDARY =
  "btn-secondary flex items-center justify-center border border-white/25 px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-white";

const EYEBROW =
  "m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-brand";

/* Heroes ------------------------------------------------------------- */

/** The event page's hero: centred title, standfirst, a row of tiles
 *  divided by hairlines — here the four numbers — then a wide picture. */
export function HeroCentered() {
  return (
    <section className="relative py-10">
      <div className="shell flex flex-col items-center gap-6 text-center">
        <p className={EYEBROW} data-reveal="up">{c.eyebrow}</p>
        <h1 className="display-text text-white" data-reveal="clip">{c.title}</h1>
        <p className="m-0 max-w-[838px] font-[family-name:var(--font-display)] text-body text-content-secondary" data-reveal="up">
          {c.intro}
        </p>
        <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-x-8 gap-y-2 p-0" data-reveal="up">
          {c.stats.map((s, i) => (
            <li key={s.note} className="flex items-center gap-8">
              {i > 0 ? <span aria-hidden className="hidden h-[76px] w-px bg-white/15 sm:block" /> : null}
              <span className="flex flex-col items-start px-2 py-3 text-left">
                <span className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">{s.note}</span>
                <span className={`font-[family-name:var(--font-display)] text-title-section font-semibold ${s.accent ? "text-brand" : "text-text-primary"}`}>
                  {s.value}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap justify-center gap-3" data-reveal="up">
          <CtaYellow>Become a sponsor</CtaYellow>
          <a href="#cases" className={SECONDARY}>{c.secondary.label}</a>
        </div>
      </div>
      <div className="shell mt-12">
        <span className="relative block aspect-[1272/560] w-full overflow-hidden" data-reveal="up">
          <Image src={c.heroImage} alt="" fill priority sizes="(min-width: 1512px) 1272px, 100vw" className="object-cover" />
        </span>
      </div>
    </section>
  );
}

/** The event page's hospitality intro: title and standfirst on the left,
 *  the four numbers on the right as icon rows divided by hairlines. */
const STAT_ICONS = ["/assets/ic-hosp-private-48.svg", "/assets/ic-hosp-contact-48.svg", "/assets/ic-hosp-included-48.svg", "/assets/ic-values-64.svg"];
export function HeroSplit() {
  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col justify-center gap-6">
          <p className={EYEBROW} data-reveal="up">{c.eyebrow}</p>
          <h1 className="section-title max-w-[9ch] text-white" data-reveal="clip">{c.title}</h1>
          <p className="m-0 max-w-[480px] font-[family-name:var(--font-display)] text-body text-content-secondary">{c.intro}</p>
          <div className="flex flex-wrap gap-3">
            <CtaYellow>Become a sponsor</CtaYellow>
            <a href="#cases" className={SECONDARY}>{c.secondary.label}</a>
          </div>
        </div>
        <ul className="m-0 flex list-none flex-col gap-6 p-0" data-reveal="up" data-reveal-stagger>
          {c.stats.map((s, i) => (
            <li key={s.note} className={`flex gap-6 sm:gap-8 ${i > 0 ? "border-t border-white/10 pt-6" : ""}`}>
              <Image src={STAT_ICONS[i % STAT_ICONS.length]} alt="" width={48} height={48} className="size-10 shrink-0 sm:size-12" />
              <div className="flex min-w-0 flex-col gap-2">
                <span className={`card-title ${s.accent ? "text-brand" : "text-white"}`}>{s.value}</span>
                <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">{s.note}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Formats ------------------------------------------------------------ */

/** "Explore tickets": the formats as landscape stubs, two across. */
export function FormatStubs() {
  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell flex flex-col items-center gap-12">
        <h2 className="section-title text-center text-white" data-reveal="clip">{c.formats.title}</h2>
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2" data-reveal="up" data-reveal-stagger>
          {c.formats.items.map((f) => (
            <article key={f.title} className="ticket-row flex min-w-0 items-stretch">
              <span aria-hidden className="ticket-row__edge" />
              <div className="flex min-w-0 flex-1 flex-col justify-center bg-bg-tertiary py-4">
                <div className="flex flex-col items-start gap-4 bg-bg-secondary p-6 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="card-title text-content-primary">{f.title}</h3>
                    <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{f.body}</p>
                  </div>
                  <SponsorCtaButton className="sweep flex shrink-0 items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e]">
                    <span className="relative z-10">Ask about this</span>
                  </SponsorCtaButton>
                </div>
              </div>
              <span aria-hidden className="ticket-row__edge ticket-row__edge--right" />
            </article>
          ))}
          <article className="flex flex-col items-start justify-center gap-3 bg-brand p-6 text-[#0b0b0e]">
            <h3 className="card-title">{c.formats.tailored.title}</h3>
            <p className="m-0 font-[family-name:var(--font-display)] text-body">{c.formats.tailored.body}</p>
            <SponsorCtaButton className="bg-[#0b0b0e] px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-white">
              {c.formats.tailored.label}
            </SponsorCtaButton>
          </article>
        </div>
      </div>
    </section>
  );
}

/** The hospitality rail: a card per format — photo, name, line, rule, ask —
 *  slid along by the page's scroll on desktop. */
export function FormatRail() {
  return (
    <section className="relative overflow-hidden py-16 xl:py-20">
      <div className="shell flex flex-col gap-12">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2 className="section-title max-w-[12ch] text-white" data-reveal="clip">{c.formats.title}</h2>
          <p className="m-0 max-w-[403px] font-[family-name:var(--font-display)] text-body text-content-secondary">{c.formats.intro}</p>
        </div>
        <ScrollRail className="-mr-[var(--shell-gutter)] min-w-0 overflow-x-auto pb-2 pr-[var(--shell-gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="m-0 flex list-none gap-8 p-0">
            {c.formats.items.map((f) => (
              <li key={f.title} className="w-[78vw] shrink-0 sm:w-[360px] xl:w-[403px]">
                <article className="flex h-full flex-col border border-white/5 bg-bg-tertiary">
                  <div className="relative aspect-[403/268.667] w-full shrink-0 overflow-hidden">
                    <Image src={f.image} alt="" fill sizes="(min-width: 1280px) 403px, 78vw" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-6 p-8">
                    <div className="flex flex-col gap-2">
                      <h3 className="card-title text-white">{f.title}</h3>
                      <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{f.body}</p>
                    </div>
                    <span aria-hidden className="mt-auto block h-px w-full bg-white/10" />
                    <SponsorCtaButton className="sweep flex w-full items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e]">
                      <span className="relative z-10">Ask about this</span>
                    </SponsorCtaButton>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </ScrollRail>
      </div>
    </section>
  );
}

/** The homepage's news rows: the formats as numbered, ruled lines, each
 *  with the square arrow button that opens the enquiry. */
export function FormatRows() {
  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell flex flex-col items-center gap-12">
        <h2 className="section-title text-center text-white" data-reveal="clip">{c.formats.title}</h2>
        <ol className="m-0 w-full list-none p-0">
          {c.formats.items.map((f, i) => (
            <li key={f.title} className="group grid grid-cols-[40px_1fr_auto] items-center gap-x-6 gap-y-2 border-b border-white/10 py-6 lg:grid-cols-[60px_320px_1fr_auto]">
              <span className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-[family-name:var(--font-display)] text-title-section font-bold uppercase text-white transition-colors group-hover:text-brand">{f.title}</span>
              <SponsorCtaButton className="row-span-2 flex size-12 items-center justify-center border border-white/25 transition-colors hover:border-white lg:order-last lg:row-span-1">
                <Image src="/assets/ic-arrow-right-24.svg" alt="" width={24} height={24} className="size-6" />
                <span className="sr-only">Ask about {f.title}</span>
              </SponsorCtaButton>
              <span className="col-start-2 font-[family-name:var(--font-display)] text-body text-content-secondary lg:col-start-auto">{f.body}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Audience ----------------------------------------------------------- */

const REACH_ICONS = ["/assets/ic-age.svg", "/assets/ic-map-pin.svg", "/assets/ic-acct-profile.svg", "/assets/ic-acct-loyalty.svg"];

/** "You need to know": the audience as the house-rule tiles. */
export function AudienceTiles() {
  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell flex flex-col items-center gap-12">
        <h2 className="section-title text-center text-white" data-reveal="clip">{c.audience.title}</h2>
        <div className="flex w-full flex-wrap justify-center gap-8" data-reveal="up" data-reveal-stagger>
          {c.audience.cards.map((a, i) => (
            <div key={a.label} className="lift flex h-[178px] w-[228px] flex-col items-center justify-center gap-4 border border-ink-600 p-6 text-center">
              <Image src={REACH_ICONS[i % REACH_ICONS.length]} alt="" width={32} height={32} className="size-8" />
              <div className="flex flex-col gap-1">
                <p className="m-0 font-[family-name:var(--font-display)] text-title-body font-bold uppercase text-text-primary">{a.label} · {a.value}</p>
                <p className="m-0 font-[family-name:var(--font-display)] text-body text-text-secondary">{a.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The homepage's mission/vision/values: the audience as icon cards. */
export function AudienceCards() {
  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-12">
        <h2 className="section-title text-white" data-reveal="clip">{c.audience.title}</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {c.audience.cards.map((a, i) => (
            <article key={a.label} className="flex flex-col gap-4 bg-bg-secondary p-8" data-reveal="up">
              <Image src={REACH_ICONS[i % REACH_ICONS.length]} alt="" width={48} height={48} className="size-12" />
              <span className="font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-text-secondary">{a.label}</span>
              <span className="card-title text-brand">{a.value}</span>
              <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{a.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Case studies ------------------------------------------------------- */

/** The hospitality rail, carrying the case studies. */
export function CaseRail() {
  return (
    <section id="cases" className="relative scroll-mt-24 overflow-hidden bg-bg-secondary py-16 xl:py-20">
      <div className="shell flex flex-col gap-12">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2 className="section-title max-w-[16ch] text-white" data-reveal="clip">{c.caseStudies.title}</h2>
          <p className="m-0 max-w-[403px] font-[family-name:var(--font-display)] text-body text-content-secondary">{c.caseStudies.intro}</p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {c.caseStudies.items.map((k) => (
            <article key={k.brand} className="flex flex-col border border-white/5 bg-bg-tertiary" data-reveal="up">
              <div className="relative aspect-[403/268.667] w-full overflow-hidden">
                <Image src={k.image} alt="" fill sizes="(min-width: 1024px) 403px, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-8">
                <span className="font-[family-name:var(--font-display)] text-caption font-bold uppercase text-content-secondary">{k.kind} · {k.festival}</span>
                <h3 className="card-title text-white">{k.brand}</h3>
                <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
                  {k.experience} {k.todo ? <span className="text-brand/80">{k.todo}</span> : null}
                </p>
                <span aria-hidden className="mt-auto block h-px w-full bg-white/10" />
                <div className="grid grid-cols-2 gap-4">
                  {k.metrics.map((m) => (
                    <div key={m.note} className="flex flex-col">
                      <span className="font-[family-name:var(--font-display)] text-title-section font-bold text-brand">{m.value}</span>
                      <span className="font-[family-name:var(--font-display)] text-body-s text-content-secondary">{m.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The homepage's news rows, carrying the case studies: number, brand and
 *  what they did, the festival, and a picture that comes up on hover. */
export function CaseRows() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section id="cases" className="relative scroll-mt-24 py-16 xl:py-20">
      <div className="shell flex flex-col items-center gap-12">
        <h2 className="section-title max-w-[18ch] text-center text-white" data-reveal="clip">{c.caseStudies.title}</h2>
        <ol className="relative m-0 w-full list-none p-0" onMouseLeave={() => setHover(null)}>
          {c.caseStudies.items.map((k, i) => (
            <li key={k.brand} onMouseEnter={() => setHover(i)} className="group grid grid-cols-[40px_1fr] items-center gap-x-6 gap-y-3 border-b border-white/10 py-6 lg:grid-cols-[60px_1fr_220px_auto]">
              <span className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex flex-col gap-1">
                <span className="font-[family-name:var(--font-display)] text-title-section font-bold uppercase text-white transition-colors group-hover:text-brand">
                  {k.brand} — {k.kind}
                </span>
                <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">{k.experience}</span>
              </span>
              <span className="col-start-2 font-[family-name:var(--font-display)] text-body-s text-text-secondary lg:col-start-auto">
                {k.metrics.map((m) => `${m.value} ${m.note}`).join(" · ")}
              </span>
              <SponsorCtaButton className="col-start-2 flex size-12 items-center justify-center border border-white/25 transition-colors hover:border-white lg:col-start-auto">
                <Image src="/assets/ic-arrow-right-24.svg" alt="" width={24} height={24} className="size-6" />
                <span className="sr-only">Talk to us about a {k.kind.toLowerCase()}</span>
              </SponsorCtaButton>
            </li>
          ))}
          {/* The picture under the pointer, as the news list's thumbnail. */}
          {c.caseStudies.items.map((k, i) => (
            <span key={k.brand} aria-hidden className={`pointer-events-none absolute right-[280px] top-1/2 hidden aspect-[4/3] w-[300px] -translate-y-1/2 overflow-hidden transition-opacity duration-300 lg:block ${hover === i ? "opacity-100" : "opacity-0"}`}>
              <Image src={k.image} alt="" fill sizes="300px" className="object-cover" />
            </span>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* How it works ------------------------------------------------------- */

/** The event page's FAQ: title left, the four steps as an accordion right. */
export function HowFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <section className="relative bg-ink-900 py-16 xl:py-20">
      <div className="shell flex flex-col items-start gap-12 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-6">
          <h2 className="section-title text-white" data-reveal="clip">{c.how.title}</h2>
          <CtaYellow className="w-fit">Start with your brief</CtaYellow>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start">
          {c.how.steps.map((s, i) => {
            const on = open === i;
            return (
              <div key={s.title} className="group w-full border-b border-border-tertiary transition-colors duration-300 hover:border-white/25">
                <h3 className="m-0">
                  <button type="button" aria-expanded={on} aria-controls={`${base}-${i}`} onClick={() => setOpen(on ? null : i)} className="flex w-full cursor-pointer items-center gap-8 p-6 text-left">
                    <span className="flex size-14 shrink-0 items-center justify-center border border-border-secondary font-[family-name:var(--font-display)] text-title-body font-bold text-white group-hover:border-white/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-title-body font-bold uppercase text-white transition-colors group-hover:text-brand">{s.title}</span>
                  </button>
                </h3>
                <div id={`${base}-${i}`} className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}>
                  <div className="overflow-hidden">
                    <p className="m-0 px-6 pb-6 pl-[calc(1.5rem+56px+2rem)] font-[family-name:var(--font-display)] text-body-l text-content-secondary">{s.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Numbered rows with a yellow square, as the lineup spine sets its times. */
export function HowRows() {
  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-12">
        <h2 className="section-title text-white" data-reveal="clip">{c.how.title}</h2>
        <ol className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 xl:grid-cols-4">
          {c.how.steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3 border-t border-white/10 pt-6" data-reveal="up">
              <span aria-hidden className="block size-6 bg-brand" />
              <span className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">Step {String(i + 1).padStart(2, "0")}</span>
              <span className="font-[family-name:var(--font-display)] text-title-section font-bold uppercase text-white">{s.title}</span>
              <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">{s.body}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Proof and close ---------------------------------------------------- */

/** The event page's sponsor wall, reading "They trust us". */
export function TrustWall() {
  return <SponsorsSection event={jazzablanca} title={c.trustedBy.title} />;
}

/** The taped yellow bill that closes the event page, opening the enquiry. */
export function ClosingBill() {
  return (
    <SponsorCta
      body={c.form.body}
      action={
        <SponsorCtaButton className="mt-2 flex items-center bg-[#0b0b0e] px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-white transition-colors hover:bg-[#0b0b0e]/85">
          {c.form.submit}
        </SponsorCtaButton>
      }
    />
  );
}

/* Homepage pieces ---------------------------------------------------- */

/** The homepage hero, re-worded: YOUR BRAND / ON STAGE on the same animated
 *  ground, with a window of the stage cut through the O of ON — the hero's
 *  own pill, same proportions. */
export function HeroWord() {
  const { pill } = homeCopy.heroCut;
  return (
    <section className="relative isolate flex min-h-[calc(100svh-var(--header-h,0px))] w-full flex-col items-center justify-center gap-10 py-16">
      <HeroTerminal />
      <h1 className="sr-only">{c.title}</h1>
      <div aria-hidden className="hero-headline relative z-10 flex flex-col items-center gap-[0.1077em] font-daltown uppercase text-white" data-reveal="clip">
        <span className="block">Your brand</span>
        <span className="flex items-center justify-center">
          <span
            className="relative block shrink-0 overflow-hidden rounded-full"
            style={{ width: `${pill.width}em`, height: `${pill.height}em`, marginInlineEnd: `${pill.gapAfter}em` }}
          >
            <Image src={c.heroImage} alt="" fill priority sizes="455px" className="object-cover" />
          </span>
          <span className="block">n stage</span>
        </span>
      </div>
      <div className="shell relative z-10 flex flex-col items-center gap-6 text-center">
        <p className="m-0 max-w-[620px] font-[family-name:var(--font-display)] text-body-l text-content-primary">{c.intro}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <CtaYellow>Become a sponsor</CtaYellow>
          <a href="#cases" className={SECONDARY}>{c.secondary.label}</a>
        </div>
      </div>
    </section>
  );
}

/** The homepage's kinetic band, carrying the partners' names. */
export function PartnerBand() {
  const run = [...c.trustedBy.brands, ...c.trustedBy.brands];
  return (
    <section aria-label={c.trustedBy.title} className="relative flex overflow-hidden bg-brand py-6 text-[#0b0b0e]">
      <div aria-hidden className="band-track flex w-max shrink-0 gap-12 whitespace-nowrap">
        {run.map((b, i) => (
          <span key={i} className="display-s flex items-center gap-12 font-daltown uppercase">
            {b}
            <span className="block size-3 bg-[#0b0b0e]" />
          </span>
        ))}
      </div>
      <ul className="sr-only">
        {c.trustedBy.brands.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </section>
  );
}
