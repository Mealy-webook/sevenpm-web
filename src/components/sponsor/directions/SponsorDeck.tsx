"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { sponsorCopy } from "@/data/sponsor";
import { SponsorCtaButton } from "../SponsorDialog";

/**
 * C · Deck — the partnership deck, as the page.
 *
 * A sponsor's marketing team will read this the way they read every deck,
 * so it is one: numbered slides, each a screen, each with one job, and a
 * rail down the left that shows where you are and jumps anywhere. The
 * cases are one slide with tabs rather than three cards; the formats are a
 * table you can ask about row by row. Every "ask" opens the enquiry as a
 * pop-up — the deck never ends in a form.
 */
const EYEBROW =
  "m-0 font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.16em] text-brand";
const CTA =
  "sweep inline-flex items-center bg-brand px-6 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e] after:!bg-white";

const SLIDES = ["The pitch", "The reach", "Who you reach", "Case studies", "Formats", "How it works", "Let’s talk"];

export function SponsorDeck() {
  const c = sponsorCopy;
  const [active, setActive] = useState(0);
  const [caseIdx, setCaseIdx] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const k = c.caseStudies.items[caseIdx];

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.slide))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    root.current?.querySelectorAll("[data-slide]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const slide = (i: number) => ({ "data-slide": i, id: `slide-${i + 1}` });
  const num = (i: number) => (
    <span className="font-[family-name:var(--font-display)] text-body-s font-semibold tabular-nums text-text-secondary">
      {String(i + 1).padStart(2, "0")} <span className="text-white/30">/ {String(SLIDES.length).padStart(2, "0")}</span>
    </span>
  );
  const frame = "relative flex min-h-[calc(100svh-var(--header-h,0px))] flex-col justify-center gap-10 border-b border-white/10 py-16";

  return (
    <div ref={root} className="shell grid grid-cols-1 lg:grid-cols-[200px_1fr] lg:gap-12">
      {/* The rail */}
      <nav aria-label="Slides" className="hidden lg:block">
        <ol className="sticky top-28 m-0 flex list-none flex-col gap-1 p-0 py-16">
          {SLIDES.map((s, i) => (
            <li key={s}>
              <a href={`#slide-${i + 1}`} className={`flex items-center gap-3 py-2 font-[family-name:var(--font-display)] text-body-s font-semibold transition-colors ${i === active ? "text-white" : "text-white/40 hover:text-white/70"}`}>
                <span className={`block h-[2px] transition-[width,background-color] duration-300 ${i === active ? "w-8 bg-brand" : "w-4 bg-white/25"}`} />
                {String(i + 1).padStart(2, "0")} · {s}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-w-0">
        {/* 01 · The pitch */}
        <section {...slide(0)} className={frame}>
          <div className="flex items-center justify-between"><p className={EYEBROW}>{c.eyebrow}</p>{num(0)}</div>
          <div className="grid grid-cols-1 items-center gap-10 xl:grid-cols-[1fr_380px]">
            <div className="flex flex-col gap-6">
              <h1 className="display-text text-white" data-reveal="clip">{c.title}</h1>
              <p className="m-0 max-w-[520px] font-[family-name:var(--font-display)] text-body-l text-content-secondary">{c.intro}</p>
              <SponsorCtaButton className={`${CTA} w-fit`}><span className="relative z-10">Become a sponsor</span></SponsorCtaButton>
            </div>
            <span className="relative block aspect-[4/5] w-full overflow-hidden">
              <Image src={c.heroImage} alt="" fill priority sizes="380px" className="object-cover" />
            </span>
          </div>
        </section>

        {/* 02 · The reach */}
        <section {...slide(1)} className={frame}>
          <div className="flex items-center justify-between"><p className={EYEBROW}>The reach</p>{num(1)}</div>
          <dl className="m-0 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
            {c.stats.map((s) => (
              <div key={s.note} className="flex flex-col gap-2 bg-bg-primary p-8">
                <dt className={`section-title ${s.accent ? "text-brand" : "text-white"}`}>{s.value}</dt>
                <dd className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{s.note}</dd>
              </div>
            ))}
          </dl>
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-white/50">
            <span className="font-semibold text-brand">{c.trustedBy.title}: </span>
            {c.trustedBy.brands.join(" · ")}
          </p>
        </section>

        {/* 03 · Who you reach */}
        <section {...slide(2)} className={frame}>
          <div className="flex items-center justify-between"><p className={EYEBROW}>{c.audience.eyebrow}</p>{num(2)}</div>
          <h2 className="section-title text-white">{c.audience.title}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {c.audience.cards.map((a) => (
              <div key={a.label} className="flex flex-col gap-2 border border-white/10 bg-bg-secondary p-6">
                <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.12em] text-text-secondary">{a.label}</span>
                <span className="card-title text-brand">{a.value}</span>
                <span className="font-[family-name:var(--font-display)] text-body-s text-white/55">{a.note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 04 · Case studies, one at a time */}
        <section {...slide(3)} className={frame}>
          <div className="flex items-center justify-between"><p className={EYEBROW}>{c.caseStudies.eyebrow}</p>{num(3)}</div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="section-title max-w-[16ch] text-white">{c.caseStudies.title}</h2>
            <div role="tablist" aria-label="Case" className="flex gap-2">
              {c.caseStudies.items.map((item, i) => (
                <button key={item.brand} type="button" role="tab" aria-selected={i === caseIdx} onClick={() => setCaseIdx(i)}
                  className={`border px-4 py-2.5 font-[family-name:var(--font-display)] text-body font-semibold transition-colors ${i === caseIdx ? "border-brand bg-brand text-[#0b0b0e]" : "border-white/15 text-content-primary hover:border-white/40"}`}>
                  {item.brand}
                </button>
              ))}
            </div>
          </div>
          <article key={k.brand} className="deck-fade grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_1fr]">
            <span className="relative block aspect-[4/3] w-full overflow-hidden">
              <Image src={k.image} alt="" fill sizes="(min-width: 1280px) 560px, 100vw" className="object-cover" />
              <span className="absolute bottom-0 left-0 bg-black/70 px-3 py-1.5 font-[family-name:var(--font-display)] text-caption uppercase tracking-[0.1em] text-white/70">Stand-in photo</span>
            </span>
            <div className="flex flex-col justify-center gap-5">
              <div className="flex flex-wrap gap-2">
                <span className="bg-brand px-3 py-1 font-[family-name:var(--font-display)] text-caption font-bold text-[#0b0b0e]">{k.kind}</span>
                <span className="bg-white/10 px-3 py-1 font-[family-name:var(--font-display)] text-caption font-bold text-content-primary">{k.festival}</span>
              </div>
              <h3 className="display-m font-daltown uppercase text-white">{k.brand}</h3>
              <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
                <strong className="text-white">The experience:</strong> {k.experience}{" "}
                {k.todo ? <span className="text-brand/80">{k.todo}</span> : null}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {k.metrics.map((m) => (
                  <div key={m.note} className="bg-bg-secondary p-4">
                    <p className="m-0 display-s font-daltown text-brand">{m.value}</p>
                    <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-content-secondary">{m.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
          <figure className="m-0 border-l-4 border-brand pl-5">
            <blockquote className="m-0 font-[family-name:var(--font-display)] text-title-section font-bold text-white">“{c.caseStudies.quote.text}”</blockquote>
            <figcaption className="mt-2 font-[family-name:var(--font-display)] text-body-s text-text-secondary">{c.caseStudies.quote.attribution}</figcaption>
          </figure>
        </section>

        {/* 05 · Formats, as a table you can ask about */}
        <section {...slide(4)} className={frame}>
          <div className="flex items-center justify-between"><p className={EYEBROW}>{c.formats.eyebrow}</p>{num(4)}</div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="section-title text-white">{c.formats.title}</h2>
            <p className="m-0 max-w-[420px] font-[family-name:var(--font-display)] text-body text-content-secondary">{c.formats.intro}</p>
          </div>
          <ol className="m-0 list-none border-b border-white/10 p-0">
            {c.formats.items.map((f, i) => (
              <li key={f.title} className="group grid grid-cols-[48px_1fr] items-center gap-x-4 gap-y-3 border-t border-white/10 py-5 md:grid-cols-[48px_96px_220px_1fr_auto]">
                <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative hidden aspect-square w-full overflow-hidden md:block">
                  <Image src={f.image} alt="" fill sizes="96px" className="object-cover grayscale transition-[filter] group-hover:grayscale-0" />
                </span>
                <span className="display-xs font-daltown uppercase text-white">{f.title}</span>
                <span className="col-span-2 font-[family-name:var(--font-display)] text-body text-content-secondary md:col-span-1">{f.body}</span>
                <SponsorCtaButton className="col-span-2 w-fit border border-white/20 px-4 py-2.5 font-[family-name:var(--font-display)] text-body-s font-semibold text-white transition-colors hover:border-brand hover:text-brand md:col-span-1">
                  Ask about this →
                </SponsorCtaButton>
              </li>
            ))}
          </ol>
        </section>

        {/* 06 · How it works */}
        <section {...slide(5)} className={frame}>
          <div className="flex items-center justify-between"><p className={EYEBROW}>{c.how.eyebrow}</p>{num(5)}</div>
          <h2 className="section-title text-white">{c.how.title}</h2>
          <ol className="m-0 grid list-none grid-cols-1 gap-px bg-white/10 p-0 sm:grid-cols-2 xl:grid-cols-4">
            {c.how.steps.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-4 bg-bg-primary p-6">
                <span className="display-m font-daltown text-brand">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-[family-name:var(--font-display)] text-title-body font-bold text-white">{s.title}</span>
                <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">{s.body}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* 07 · Let's talk */}
        <section {...slide(6)} className={`${frame} border-b-0`}>
          <div className="flex items-center justify-between"><p className={EYEBROW}>{c.form.eyebrow}</p>{num(6)}</div>
          <div className="flex flex-col items-start gap-6 bg-brand p-8 text-[#0b0b0e] xl:p-12">
            <h2 className="section-title max-w-[14ch]">{c.form.title}</h2>
            <p className="m-0 max-w-[520px] font-[family-name:var(--font-display)] text-body-l">{c.form.body}</p>
            <div className="flex flex-wrap items-center gap-4">
              <SponsorCtaButton className="sweep inline-flex items-center bg-[#0b0b0e] px-6 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-white after:!bg-white hover:text-[#0b0b0e]">
                <span className="relative z-10">{c.form.submit} →</span>
              </SponsorCtaButton>
              <span className="font-[family-name:var(--font-display)] text-body-s text-black/60">{c.form.reply}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
