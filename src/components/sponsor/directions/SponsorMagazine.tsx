"use client";

import Image from "next/image";

import { sponsorCopy } from "@/data/sponsor";
import { SponsorCtaButton } from "../SponsorDialog";

/**
 * L · Magazine — The partnership issue.
 *
 * The page is laid out as a printed feature about partnering with SEVENPM:
 * a cover with the festival photograph and the numbers as cover lines, a
 * contents page that lists the five formats with page numbers (each one a
 * jump), the case studies as two-page spreads with a captioned photo, a
 * pull quote and a data box, the audience as an infographic, and the ask on
 * the back cover in yellow. The look is the site's own; the reading order is
 * an editorial one no other page uses.
 */
const c = sponsorCopy;

const CTA =
  "sweep inline-flex items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e]";
const KICKER =
  "m-0 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[0.18em]";

export function SponsorMagazinePage() {
  const pages = c.formats.items.map((_, i) => 12 + i * 4);

  return (
    <>
      {/* The cover */}
      <section className="relative py-10">
        <div className="shell">
          <div className="relative isolate flex min-h-[720px] flex-col justify-between overflow-hidden p-6 sm:p-10">
            <Image src={c.heroImage} alt="" fill priority sizes="(min-width: 1512px) 1272px, 100vw" className="-z-20 object-cover" />
            <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/10 to-black/85" />
            {/* masthead */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/30 pb-4">
              <p className={`${KICKER} text-white`}>SEVENPM · The partnership issue</p>
              <p className={`${KICKER} text-white`}>No. 01 · 2027 season · Jazzablanca & Tanjazz</p>
            </div>
            <h1 className="display-text max-w-[10ch] text-white" data-reveal="clip">{c.title}</h1>
            {/* cover lines: the numbers */}
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {c.stats.map((s) => (
                <p key={s.note} className="m-0 flex flex-col gap-1 border-t-2 border-brand pt-3">
                  <span className="display-s font-daltown uppercase text-white">{s.value}</span>
                  <span className="font-[family-name:var(--font-display)] text-body-s text-white/80">{s.note}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contents: the formats with page numbers */}
      <section className="relative py-16 xl:py-20">
        <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-5">
            <p className={`${KICKER} text-brand`}>In this issue</p>
            <h2 className="section-title text-white" data-reveal="clip">Contents</h2>
            <p className="m-0 max-w-[420px] font-[family-name:var(--font-display)] text-body text-content-secondary">{c.intro}</p>
            <SponsorCtaButton className={`${CTA} w-fit`}><span className="relative z-10">{c.form.submit}</span></SponsorCtaButton>
          </div>
          <ol className="m-0 flex list-none flex-col p-0">
            {c.formats.items.map((f, i) => (
              <li key={f.title} className="group border-t border-white/15">
                <a href={`#fmt-${i}`} className="grid grid-cols-[56px_1fr_auto] items-baseline gap-4 py-5">
                  <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-text-secondary">p.{pages[i]}</span>
                  <span className="flex flex-col gap-1">
                    <span className="display-xs font-daltown uppercase text-white transition-colors group-hover:text-brand">{f.title}</span>
                    <span className="font-[family-name:var(--font-display)] text-body-s text-content-secondary">{f.body}</span>
                  </span>
                  <span aria-hidden className="text-brand">→</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The audience, as an infographic */}
      <section className="relative bg-[#f4f1ea] py-16 text-[#0b0b0e] xl:py-20">
        <div className="shell flex flex-col gap-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3">
              <p className={`${KICKER} text-black/55`}>The readers · who comes</p>
              <h2 className="section-title">{c.audience.title}</h2>
            </div>
            <p className="m-0 max-w-[380px] font-[family-name:var(--font-display)] text-body text-black/65">
              Who stands in front of your brand on the night, and who keeps following after it.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px bg-black/15 sm:grid-cols-2 xl:grid-cols-4">
            {c.audience.cards.map((a) => (
              <div key={a.label} className="flex flex-col gap-3 bg-[#f4f1ea] p-6">
                <span className={`${KICKER} text-black/55`}>{a.label}</span>
                <span className="section-title">{a.value}</span>
                <span className="font-[family-name:var(--font-display)] text-body text-black/65">{a.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Each case, a spread */}
      {c.caseStudies.items.map((k, i) => (
        <section key={k.brand} id={i === 0 ? "cases" : undefined} className="relative scroll-mt-24 py-16 xl:py-20">
          <div className={`shell grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <figure className="m-0 flex flex-col gap-3">
              <span className="relative block aspect-[4/5] w-full overflow-hidden">
                <Image src={k.image} alt="" fill sizes="(min-width: 1024px) 620px, 100vw" className="object-cover" />
              </span>
              <figcaption className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">
                {k.brand} at {k.festival}, [year]. Stand-in photograph until the partner shoot.
              </figcaption>
            </figure>
            <div className="flex flex-col justify-center gap-6">
              <p className={`${KICKER} text-brand`}>Case study {String(i + 1).padStart(2, "0")} · {k.kind}</p>
              <h2 className="section-title text-white">{k.brand}</h2>
              <p className="m-0 font-[family-name:var(--font-display)] text-body-l text-content-primary">
                <span className="font-semibold">The experience:</span> {k.experience}
              </p>
              {k.todo ? <p className="m-0 font-[family-name:var(--font-display)] text-body text-brand/80">{k.todo}</p> : null}
              {/* One quote in the data, so it runs on the first spread only. */}
              {i === 0 ? (
              <blockquote className="m-0 border-l-4 border-brand pl-5 font-daltown text-white">
                <span className="display-xs uppercase">“{c.caseStudies.quote.text}”</span>
                <footer className="mt-2 font-[family-name:var(--font-display)] text-body-s normal-case text-text-secondary">{c.caseStudies.quote.attribution}</footer>
              </blockquote>
              ) : null}
              <dl className="m-0 grid grid-cols-2 gap-4 bg-bg-secondary p-5">
                {k.metrics.map((m) => (
                  <div key={m.note}>
                    <dd className="display-s m-0 font-daltown text-brand">{m.value}</dd>
                    <dt className="font-[family-name:var(--font-display)] text-body-s text-content-secondary">{m.note}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      ))}

      {/* The formats, each a short article with its page number */}
      <section className="relative border-t border-white/10 py-16 xl:py-20">
        <div className="shell flex flex-col gap-10">
          <h2 className="section-title text-white" data-reveal="clip">{c.formats.title}</h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {c.formats.items.map((f, i) => (
              <article key={f.title} id={`fmt-${i}`} className="flex scroll-mt-28 flex-col gap-3">
                <span className="relative block aspect-[3/2] w-full overflow-hidden">
                  <Image src={f.image} alt="" fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
                </span>
                <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-text-secondary">p.{pages[i]}</span>
                <h3 className="card-title text-white">{f.title}</h3>
                <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{f.body}</p>
                <SponsorCtaButton className="w-fit font-[family-name:var(--font-display)] text-body font-semibold text-brand underline underline-offset-4">Ask about this →</SponsorCtaButton>
              </article>
            ))}
            <article className="flex flex-col justify-center gap-3 border-2 border-dashed border-white/20 p-6">
              <h3 className="card-title text-white">{c.formats.tailored.title}</h3>
              <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{c.formats.tailored.body}</p>
              <SponsorCtaButton className={`${CTA} w-fit`}><span className="relative z-10">{c.formats.tailored.label}</span></SponsorCtaButton>
            </article>
          </div>
        </div>
      </section>

      {/* Back cover */}
      <section className="relative py-10">
        <div className="shell">
          <div className="flex min-h-[460px] flex-col justify-between gap-10 bg-brand p-8 text-[#0b0b0e] sm:p-12">
            <div className="flex flex-wrap justify-between gap-4 border-b border-black/30 pb-4">
              <p className={KICKER}>Back cover</p>
              <p className={KICKER}>{c.how.title}: brief · proposal · co-creation · report</p>
            </div>
            <h2 className="display-text max-w-[12ch]">Let’s talk.</h2>
            <div className="flex flex-wrap items-center gap-4">
              <SponsorCtaButton className="bg-[#0b0b0e] px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-white">{c.form.submit} →</SponsorCtaButton>
              <p className="m-0 font-[family-name:var(--font-display)] text-body">{c.trustedBy.title}: {c.trustedBy.brands.slice(0, 6).join(" · ")}…</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
