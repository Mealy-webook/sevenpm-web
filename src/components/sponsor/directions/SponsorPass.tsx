"use client";

import Image from "next/image";
import { useState } from "react";

import { sponsorCopy } from "@/data/sponsor";
import { SponsorCtaButton } from "../SponsorDialog";

/**
 * J · Backstage pass.
 *
 * A sponsorship is access, so the page is built from the thing that grants
 * it: the laminate a partner wears on the night. The hero hangs one on a
 * lanyard with the visitor's brand still to be printed on it; the five
 * formats are five passes, the top tier in brand yellow; the case studies
 * turn one at a time like passes on a hook; the close is a sheet with an
 * empty logo slot. The site's own vocabulary throughout — Daltown, the
 * yellow, square edges, the dashed ticket perforation — in a layout no
 * other page uses. Every ask opens the enquiry pop-up.
 */
const c = sponsorCopy;

const CTA =
  "sweep inline-flex items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e]";

/** The barcode strip along a pass's foot. */
function Barcode({ dark = false }: { dark?: boolean }) {
  return (
    <span
      aria-hidden
      className="block h-8 w-full"
      style={{
        backgroundImage: `repeating-linear-gradient(90deg, ${dark ? "#0b0b0e" : "#e4e4e7"} 0 2px, transparent 2px 5px, ${dark ? "#0b0b0e" : "#e4e4e7"} 5px 6px, transparent 6px 9px)`,
        opacity: 0.6,
      }}
    />
  );
}

/** One laminate. `tone` picks the header band. */
function Pass({
  tone,
  tier,
  title,
  image,
  body,
  children,
  className = "",
}: {
  tone: "brand" | "light" | "dark";
  tier: string;
  title: string;
  image?: string;
  body?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const band = tone === "brand" ? "bg-brand text-[#0b0b0e]" : tone === "light" ? "bg-content-primary text-[#0b0b0e]" : "bg-bg-tertiary text-white";
  return (
    <article className={`relative flex flex-col border border-white/10 bg-bg-secondary shadow-[0_30px_60px_rgba(0,0,0,0.5)] ${className}`}>
      {/* the slot the lanyard clips through */}
      <span aria-hidden className="absolute left-1/2 top-3 z-10 block h-2.5 w-14 -translate-x-1/2 rounded-full bg-bg-primary" />
      <div className={`flex items-end justify-between gap-3 px-5 pb-3 pt-8 ${band}`}>
        <span className="font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[0.16em]">{tier}</span>
        <span className="font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[0.16em]">2027</span>
      </div>
      {image ? (
        <span className="relative block aspect-[4/3] w-full overflow-hidden">
          <Image src={image} alt="" fill sizes="320px" className="object-cover" />
        </span>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="display-xs m-0 font-daltown uppercase text-white">{title}</h3>
        {body ? <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-content-secondary">{body}</p> : null}
        {children}
      </div>
      <div className="border-t border-dashed border-white/15 px-5 py-4">
        <Barcode />
      </div>
    </article>
  );
}

export function SponsorPassPage() {
  const [caseIdx, setCaseIdx] = useState(0);
  const k = c.caseStudies.items[caseIdx];
  const tiers: ("brand" | "light" | "dark")[] = ["dark", "dark", "light", "dark", "brand"];
  const tierNames = ["Stage", "Zone", "VIP", "Digital", "All access"];

  return (
    <>
      {/* Hero: the pitch beside a pass on a lanyard, waiting for a name */}
      <section className="relative overflow-hidden py-16 xl:py-20">
        <div className="shell grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_400px]">
          <div className="flex flex-col gap-6">
            <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-brand">{c.eyebrow}</p>
            <h1 className="display-text max-w-[11ch] text-white" data-reveal="clip">{c.title}</h1>
            <p className="m-0 max-w-[520px] font-[family-name:var(--font-display)] text-body-l text-content-secondary">{c.intro}</p>
            <div className="flex flex-wrap gap-3">
              <SponsorCtaButton className={CTA}><span className="relative z-10">Get your pass</span></SponsorCtaButton>
              <a href="#pass-formats" className="btn-secondary inline-flex items-center border border-white/25 px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-white">See the formats</a>
            </div>
          </div>
          <div className="relative mx-auto flex w-[320px] flex-col items-center">
            {/* the lanyard */}
            <span aria-hidden className="block h-28 w-6 bg-brand [clip-path:polygon(0_0,100%_0,70%_100%,30%_100%)]" />
            <div className="pass-swing w-full origin-top">
              <Pass tone="brand" tier="Partner · All access" title="Your brand here" image={c.heroImage}>
                <span className="flex h-20 items-center justify-center border-2 border-dashed border-white/25 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-white/50">
                  Your logo
                </span>
              </Pass>
            </div>
          </div>
        </div>
      </section>

      {/* The numbers, printed like the pass's own fields */}
      <section className="relative border-y border-white/10">
        <dl className="shell m-0 grid grid-cols-2 xl:grid-cols-4">
          {c.stats.map((s, i) => (
            <div key={s.note} className={`flex flex-col gap-2 py-10 ${i % 2 ? "pl-6 xl:pl-8" : "pr-6"} ${i > 0 ? "xl:border-l xl:border-white/10 xl:pl-8" : ""}`}>
              <dt className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.16em] text-text-secondary">{s.note}</dt>
              <dd className={`card-title m-0 ${s.accent ? "text-brand" : "text-white"}`}>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Formats: five passes, the top tier in yellow */}
      <section id="pass-formats" className="relative scroll-mt-24 overflow-hidden py-16 xl:py-20">
        <div className="shell flex flex-col gap-12">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="section-title max-w-[12ch] text-white" data-reveal="clip">Choose your access</h2>
            <p className="m-0 max-w-[420px] font-[family-name:var(--font-display)] text-body text-content-secondary">{c.formats.intro}</p>
          </div>
          <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {c.formats.items.map((f, i) => (
              <li key={f.title} className={`transition-[translate,rotate] duration-500 hover:-translate-y-2 hover:!rotate-0 ${i % 2 ? "lg:rotate-[1.5deg]" : "lg:-rotate-[1.5deg]"}`} data-reveal="up">
                <Pass tone={tiers[i]} tier={tierNames[i]} title={f.title} image={f.image} body={f.body} className="h-full">
                  <SponsorCtaButton className="mt-auto pt-2 text-left font-[family-name:var(--font-display)] text-body-s font-semibold text-brand underline underline-offset-4">
                    Ask about this pass →
                  </SponsorCtaButton>
                </Pass>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-start gap-4 border-2 border-dashed border-white/20 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="display-xs m-0 font-daltown uppercase text-white">{c.formats.tailored.title}</p>
              <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{c.formats.tailored.body}</p>
            </div>
            <SponsorCtaButton className={CTA}><span className="relative z-10">{c.formats.tailored.label}</span></SponsorCtaButton>
          </div>
        </div>
      </section>

      {/* Who holds a ticket: the audience on one strip */}
      <section className="relative bg-bg-secondary py-16 xl:py-20">
        <div className="shell grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-8">
            <h2 className="section-title text-white" data-reveal="clip">{c.audience.title}</h2>
            <dl className="m-0 grid grid-cols-2 gap-x-8 gap-y-8">
              {c.audience.cards.map((a) => (
                <div key={a.label} className="flex flex-col gap-1 border-t-2 border-brand pt-4">
                  <dt className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.16em] text-text-secondary">{a.label}</dt>
                  <dd className="display-s m-0 font-daltown text-white">{a.value}</dd>
                  <dd className="m-0 font-[family-name:var(--font-display)] text-body-s text-content-secondary">{a.note}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative rotate-1 bg-[#f4f1ea] p-3 pb-14 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            <span aria-hidden className="absolute left-1/2 top-0 block h-[24px] w-[110px] -translate-x-1/2 -translate-y-1/2 -rotate-3 bg-[rgba(217,217,217,0.45)]" />
            <span className="relative block aspect-[4/3] w-full overflow-hidden">
              <Image src={c.audience.image} alt="" fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
            </span>
          </div>
        </div>
      </section>

      {/* Cases: one at a time, like passes on a hook */}
      <section className="relative py-16 xl:py-20">
        <div className="shell flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="section-title max-w-[14ch] text-white" data-reveal="clip">{c.caseStudies.title}</h2>
            <div className="flex gap-2">
              {c.caseStudies.items.map((item, i) => (
                <button key={item.brand} type="button" onClick={() => setCaseIdx(i)} aria-pressed={i === caseIdx}
                  className={`border px-4 py-2.5 font-[family-name:var(--font-display)] text-body font-semibold transition-colors ${i === caseIdx ? "border-brand bg-brand text-[#0b0b0e]" : "border-white/15 text-content-primary hover:border-white/40"}`}>
                  {item.brand}
                </button>
              ))}
            </div>
          </div>
          <div key={k.brand} className="deck-fade grid grid-cols-1 gap-0 border border-white/10 lg:grid-cols-[1.3fr_1fr]">
            <span className="relative block aspect-[4/3] w-full overflow-hidden lg:aspect-auto">
              <Image src={k.image} alt="" fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
            </span>
            <div className="flex flex-col gap-6 bg-bg-secondary p-8">
              <span className="w-fit bg-brand px-3 py-1 font-[family-name:var(--font-display)] text-caption font-bold uppercase text-[#0b0b0e]">{k.kind} · {k.festival}</span>
              <h3 className="card-title text-white">{k.brand}</h3>
              <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
                <strong className="text-white">The experience:</strong> {k.experience} {k.todo ? <span className="text-brand/80">{k.todo}</span> : null}
              </p>
              <dl className="m-0 mt-auto grid grid-cols-2 gap-4 border-t border-dashed border-white/15 pt-6">
                {k.metrics.map((m) => (
                  <div key={m.note}>
                    <dd className="display-s m-0 font-daltown text-brand">{m.value}</dd>
                    <dt className="font-[family-name:var(--font-display)] text-body-s text-content-secondary">{m.note}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* How: four steps along a perforation */}
      <section className="relative py-16 xl:py-20">
        <div className="shell flex flex-col gap-12">
          <h2 className="section-title text-white" data-reveal="clip">{c.how.title}</h2>
          <ol className="relative m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 xl:grid-cols-4">
            <span aria-hidden className="absolute left-0 right-0 top-3 hidden border-t-2 border-dashed border-white/20 xl:block" />
            {c.how.steps.map((s, i) => (
              <li key={s.title} className="relative flex flex-col gap-3">
                <span className="relative block size-6 bg-brand" />
                <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.16em] text-text-secondary">Step {i + 1}</span>
                <span className="font-[family-name:var(--font-display)] text-title-section font-bold uppercase text-white">{s.title}</span>
                <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">{s.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Close: a sheet with the logo slot left empty */}
      <section className="relative bg-brand py-16 text-[#0b0b0e] xl:py-20">
        <div className="shell grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-4">
            <h2 className="section-title">{c.form.title}</h2>
            <p className="m-0 max-w-[520px] font-[family-name:var(--font-display)] text-body-l">{c.form.body}</p>
            <SponsorCtaButton className="w-fit bg-[#0b0b0e] px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-white">{c.form.submit} →</SponsorCtaButton>
          </div>
          <div className="flex h-[200px] items-center justify-center border-4 border-dashed border-black/30 font-daltown text-[#0b0b0e]/40">
            <span className="display-s uppercase">Your logo</span>
          </div>
        </div>
      </section>
    </>
  );
}
