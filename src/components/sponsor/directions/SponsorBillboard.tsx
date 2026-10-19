"use client";

import Image from "next/image";
import { useState } from "react";

import { sponsorCopy } from "@/data/sponsor";
import { SponsorCtaButton } from "../SponsorDialog";

/**
 * A · Billboard — the pitch at poster scale.
 *
 * Type does the work. The title fills the screen in three lines with a
 * photograph cut into it as a window, the homepage hero's own move; the
 * numbers are set as big as the title; the partners are a wall of names;
 * each case study is a full-width row with the brand at display size; the
 * five formats are tall columns that open one at a time; the close is a
 * yellow wall with one word on it. Every call to action opens the enquiry
 * as a pop-up.
 */
const CTA =
  "sweep inline-flex items-center bg-brand px-6 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e] after:!bg-white";

export function SponsorBillboard() {
  const c = sponsorCopy;
  return (
    <>
      {/* The pitch */}
      <section className="relative overflow-hidden py-16 xl:py-20">
        <div className="shell flex flex-col gap-10">
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.16em] text-brand" data-reveal="up">
            {c.eyebrow}
          </p>
          <h1 aria-label={c.title} className="display-text m-0 flex flex-col font-daltown uppercase text-white" data-reveal="clip">
            <span aria-hidden className="flex items-center gap-[0.12em]">
              Put your
              <span className="relative inline-block h-[0.72em] w-[1.6em] overflow-hidden rounded-full align-middle">
                <Image src={c.heroImage} alt="" fill priority sizes="380px" className="object-cover" />
              </span>
            </span>
            <span aria-hidden>brand on</span>
            <span aria-hidden className="flex items-center gap-[0.12em]">
              <span className="bg-brand px-[0.06em] text-[#0b0b0e]">stage.</span>
            </span>
          </h1>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-body-l text-content-secondary" data-reveal="up">
              {c.intro}
            </p>
            <div className="flex flex-wrap gap-3" data-reveal="up">
              <SponsorCtaButton className={CTA}>
                <span className="relative z-10">Become a sponsor</span>
              </SponsorCtaButton>
              <a href="#bb-cases" className="btn-secondary inline-flex items-center border border-white/25 px-6 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-white">
                {c.secondary.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The numbers, as big as the title */}
      <section className="relative border-y border-white/10">
        <div className="shell grid grid-cols-1 sm:grid-cols-2">
          {c.stats.map((s, i) => (
            <div
              key={s.note}
              data-reveal="up"
              className={`flex flex-col gap-3 py-10 sm:px-8 ${i % 2 ? "sm:border-l sm:border-white/10" : "sm:pl-0"} ${i > 1 ? "sm:border-t sm:border-white/10" : ""}`}
            >
              <span className={`section-title font-daltown uppercase ${s.accent ? "text-brand" : "text-white"}`}>
                {s.value}
              </span>
              <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">{s.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* The partners, a wall of names */}
      <section className="relative py-16 xl:py-20">
        <div className="shell flex flex-col gap-6">
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.16em] text-brand">
            {c.trustedBy.title}
          </p>
          <p className="display-m m-0 flex flex-wrap gap-x-[0.35em] font-daltown uppercase" data-reveal="up">
            {c.trustedBy.brands.map((b, i) => (
              <span key={b} className={i % 3 === 1 ? "text-white/35" : "text-white"}>
                {b}
                {i < c.trustedBy.brands.length - 1 ? <span className="text-brand">·</span> : null}
              </span>
            ))}
          </p>
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-white/35">{c.trustedBy.note}</p>
        </div>
      </section>

      {/* Audience */}
      <section className="relative border-t border-white/10 py-16 xl:py-20">
        <div className="shell flex flex-col gap-10">
          <h2 className="section-title text-white" data-reveal="clip">{c.audience.title}</h2>
          <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
            {c.audience.cards.map((a) => (
              <div key={a.label} className="flex flex-col gap-2" data-reveal="up">
                <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.14em] text-text-secondary">{a.label}</span>
                <span className="display-m font-daltown text-brand">{a.value}</span>
                <span className="font-[family-name:var(--font-display)] text-body text-white/50">{a.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases, a row each */}
      <section id="bb-cases" className="relative scroll-mt-24 py-16 xl:py-20">
        <div className="shell flex flex-col gap-8">
          <h2 className="section-title max-w-[16ch] text-white" data-reveal="clip">{c.caseStudies.title}</h2>
          <ol className="m-0 flex list-none flex-col p-0">
            {c.caseStudies.items.map((k, i) => (
              <li key={k.brand} className="group grid grid-cols-1 items-center gap-6 border-t border-white/10 py-8 lg:grid-cols-[320px_1fr_auto] lg:gap-10" data-reveal="up">
                <span className="relative block aspect-[4/3] w-full overflow-hidden">
                  <Image src={k.image} alt="" fill sizes="320px" className="object-cover grayscale transition-[filter,scale] duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                </span>
                <div className="flex flex-col gap-3">
                  <span className="font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-brand">
                    {String(i + 1).padStart(2, "0")} · {k.kind} · {k.festival}
                  </span>
                  <h3 className="section-title m-0 font-daltown uppercase text-white">{k.brand}</h3>
                  <p className="m-0 max-w-[56ch] font-[family-name:var(--font-display)] text-body text-content-secondary">
                    <strong className="text-white">The experience:</strong> {k.experience}{" "}
                    {k.todo ? <span className="text-brand/80">{k.todo}</span> : null}
                  </p>
                </div>
                <div className="flex gap-8 lg:flex-col lg:gap-4">
                  {k.metrics.map((m) => (
                    <div key={m.note} className="flex flex-col">
                      <span className="display-s font-daltown leading-none text-brand">{m.value}</span>
                      <span className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">{m.note}</span>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <figure className="m-0 border-l-4 border-brand pl-6">
            <blockquote className="card-title m-0 font-daltown uppercase text-white">“{c.caseStudies.quote.text}”</blockquote>
            <figcaption className="mt-3 font-[family-name:var(--font-display)] text-body-s text-text-secondary">{c.caseStudies.quote.attribution}</figcaption>
          </figure>
        </div>
      </section>

      <BillboardFormats />

      {/* How it works, one line */}
      <section className="relative border-y border-white/10 py-16 xl:py-20">
        <div className="shell flex flex-col gap-10">
          <h2 className="section-title text-white" data-reveal="clip">{c.how.title}</h2>
          <ol className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 xl:grid-cols-4">
            {c.how.steps.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3" data-reveal="up">
                <span className="section-title font-daltown text-white/15">{i + 1}</span>
                <span className="card-title text-white">{s.title}</span>
                <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">{s.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The close */}
      <section className="relative bg-brand py-16 text-[#0b0b0e] xl:py-24">
        <div className="shell flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="display-text m-0 font-daltown uppercase">Let’s talk.</h2>
          <div className="flex max-w-[380px] flex-col gap-4">
            <p className="m-0 font-[family-name:var(--font-display)] text-body-l font-medium">{c.form.body}</p>
            <SponsorCtaButton className="sweep inline-flex w-fit items-center bg-[#0b0b0e] px-6 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-white after:!bg-white hover:text-[#0b0b0e]">
              <span className="relative z-10">{c.form.submit} →</span>
            </SponsorCtaButton>
          </div>
        </div>
      </section>
    </>
  );
}

/** Five tall columns, one open at a time, each with its picture. */
function BillboardFormats() {
  const { title, intro, items, tailored } = sponsorCopy.formats;
  const [open, setOpen] = useState(0);
  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="section-title text-white" data-reveal="clip">{title}</h2>
          <p className="m-0 max-w-[440px] font-[family-name:var(--font-display)] text-body text-content-secondary">{intro}</p>
        </div>
        <ul className="m-0 flex list-none flex-col gap-2 p-0 lg:h-[560px] lg:flex-row">
          {items.map((f, i) => {
            const on = i === open;
            return (
              <li
                key={f.title}
                onMouseEnter={() => setOpen(i)}
                className={`group relative isolate flex min-h-[220px] overflow-hidden transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-h-0 ${on ? "lg:flex-[4]" : "lg:flex-1"}`}
              >
                <button type="button" onClick={() => setOpen(i)} onFocus={() => setOpen(i)} aria-expanded={on} className="absolute inset-0 z-10" aria-label={f.title} />
                <Image src={f.image} alt="" fill sizes="(min-width: 1024px) 700px, 100vw" className={`-z-20 object-cover transition-[filter] duration-500 ${on ? "" : "grayscale"}`} />
                <span aria-hidden className={`absolute inset-0 -z-10 ${on ? "bg-gradient-to-t from-black/90 via-black/40 to-transparent" : "bg-black/70"}`} />
                <div className="pointer-events-none relative flex w-full flex-col justify-end gap-3 p-6">
                  <span className="display-xs font-daltown leading-none text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`font-daltown uppercase text-white ${on ? "display-s" : "display-xs lg:[writing-mode:vertical-rl] lg:rotate-180"}`}>
                    {f.title}
                  </span>
                  {on ? (
                    <p className="m-0 max-w-[44ch] font-[family-name:var(--font-display)] text-body text-content-primary">{f.body}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-4 border border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="display-xs m-0 font-daltown uppercase text-white">{tailored.title}</p>
            <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{tailored.body}</p>
          </div>
          <SponsorCtaButton className={CTA}>
            <span className="relative z-10">{tailored.label} →</span>
          </SponsorCtaButton>
        </div>
      </div>
    </section>
  );
}
