"use client";

import Image from "next/image";
import { useState } from "react";

import { sponsorCopy } from "@/data/sponsor";
import { SponsorCtaButton } from "../SponsorDialog";

/**
 * K · Site plan.
 *
 * A sponsor buys a place on the night, so the page is drawn as the ground:
 * a schematic plan of the festival site in yellow line work on black, with
 * each area — main stage, village, garden, VIP boxes, entrance — a zone you
 * can point at. The zone lights up and the panel beside it says which format
 * puts your brand there and what it includes. The audience is pinned onto a
 * crowd photograph, the partners' activations are captioned brand ·
 * festival · year (from the benchmark: SXSW), and the page promises the
 * post-festival report (Sea.Hear.Now) before the ask.
 *
 * The plan is a diagram, not a survey: the layout is illustrative until the
 * production team supplies the real site map.
 */
const c = sponsorCopy;

const CTA =
  "sweep inline-flex items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e]";

type Zone = {
  id: string;
  name: string;
  format: number; // index into c.formats.items
  /** box on a 100 × 64 plan */
  x: number;
  y: number;
  w: number;
  h: number;
};

const ZONES: Zone[] = [
  { id: "main", name: "Main stage", format: 0, x: 34, y: 4, w: 32, h: 16 },
  { id: "village", name: "The Village", format: 1, x: 6, y: 26, w: 26, h: 20 },
  { id: "vip", name: "VIP boxes", format: 2, x: 38, y: 26, w: 24, h: 10 },
  { id: "garden", name: "Garden party", format: 2, x: 68, y: 26, w: 26, h: 20 },
  { id: "app", name: "Tickets & app", format: 3, x: 38, y: 40, w: 24, h: 8 },
  { id: "entrance", name: "Entrance", format: 4, x: 30, y: 54, w: 40, h: 7 },
];

/** The audience, pinned on the crowd at these points (% of the photo). */
const PINS = [
  { x: 22, y: 30 },
  { x: 62, y: 22 },
  { x: 38, y: 64 },
  { x: 78, y: 58 },
];

export function SponsorPlanPage() {
  const [zoneId, setZoneId] = useState(ZONES[0].id);
  const zone = ZONES.find((z) => z.id === zoneId) ?? ZONES[0];
  const format = c.formats.items[zone.format];

  return (
    <>
      {/* Hero: the pitch, then the plan */}
      <section className="relative py-16 xl:py-20">
        <div className="shell flex flex-col gap-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-brand">{c.eyebrow}</p>
              <h1 className="display-text max-w-[12ch] text-white" data-reveal="clip">Pick your spot.</h1>
            </div>
            <div className="flex flex-col gap-5">
              <p className="m-0 font-[family-name:var(--font-display)] text-body-l text-content-secondary">{c.intro}</p>
              <div className="flex flex-wrap gap-3">
                <SponsorCtaButton className={CTA}><span className="relative z-10">{c.form.submit}</span></SponsorCtaButton>
              </div>
            </div>
          </div>

          {/* The plan and its panel */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="relative border border-white/10 bg-bg-secondary p-4">
              <span className="absolute left-4 top-3 font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.16em] text-text-secondary">
                Site plan · illustrative
              </span>
              <svg viewBox="0 0 100 64" className="mt-6 block h-auto w-full" role="group" aria-label="Festival site plan">
                {/* paths between zones */}
                <path d="M50 20 V26 M50 36 V40 M50 48 V54 M32 36 H38 M62 36 H68" stroke="rgba(255,255,255,0.18)" strokeWidth="0.4" strokeDasharray="1 1" fill="none" />
                {ZONES.map((z) => {
                  const on = z.id === zoneId;
                  return (
                    <g
                      key={z.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={on}
                      aria-label={`${z.name}: ${c.formats.items[z.format].title}`}
                      onMouseEnter={() => setZoneId(z.id)}
                      onFocus={() => setZoneId(z.id)}
                      onClick={() => setZoneId(z.id)}
                      className="cursor-pointer outline-none"
                    >
                      <rect
                        x={z.x}
                        y={z.y}
                        width={z.w}
                        height={z.h}
                        fill={on ? "#fbeb1c" : "rgba(251,235,28,0.06)"}
                        stroke="#fbeb1c"
                        strokeWidth={on ? 0.6 : 0.3}
                        className="transition-[fill] duration-300"
                      />
                      <text
                        x={z.x + 1.6}
                        y={z.y + 3.6}
                        fontSize="2.4"
                        fontFamily="var(--font-headline)"
                        fill={on ? "#0b0b0e" : "#fbeb1c"}
                        style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}
                      >
                        {z.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <article key={zone.id} className="deck-fade flex flex-col border border-white/10 bg-bg-secondary">
              <span className="relative block aspect-[4/3] w-full overflow-hidden">
                <Image src={format.image} alt="" fill sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
              </span>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.16em] text-brand">{zone.name}</span>
                <h2 className="card-title text-white">{format.title}</h2>
                <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{format.body}</p>
                <SponsorCtaButton className="mt-auto w-fit pt-3 font-[family-name:var(--font-display)] text-body font-semibold text-brand underline underline-offset-4">
                  Ask about this spot →
                </SponsorCtaButton>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Numbers as a legend strip */}
      <section className="relative border-y border-white/10">
        <dl className="shell m-0 grid grid-cols-2 xl:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.note} className="flex items-start gap-4 py-8">
              <span aria-hidden className="mt-2 block size-3 shrink-0 bg-brand" />
              <div className="flex flex-col gap-1">
                <dd className={`display-s m-0 font-daltown uppercase ${s.accent ? "text-brand" : "text-white"}`}>{s.value}</dd>
                <dt className="font-[family-name:var(--font-display)] text-body-s text-content-secondary">{s.note}</dt>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* Audience, pinned on the crowd */}
      <section className="relative py-16 xl:py-20">
        <div className="shell flex flex-col gap-10">
          <h2 className="section-title text-white" data-reveal="clip">{c.audience.title}</h2>
          <div className="relative isolate overflow-hidden" data-reveal="up">
            <span className="relative block aspect-[16/8] w-full">
              <Image src={c.audience.image} alt="" fill sizes="(min-width: 1512px) 1272px, 100vw" className="-z-10 object-cover" />
              <span aria-hidden className="absolute inset-0 bg-black/45" />
            </span>
            <ul className="m-0 list-none p-0">
              {c.audience.cards.map((a, i) => (
                <li
                  key={a.label}
                  className="relative mt-3 flex items-center gap-3 lg:absolute lg:mt-0"
                  style={{ left: `${PINS[i].x}%`, top: `${PINS[i].y}%` }}
                >
                  <span aria-hidden className="hidden size-4 shrink-0 rounded-full border-2 border-[#0b0b0e] bg-brand lg:block" />
                  <span className="flex flex-col bg-bg-primary/85 px-4 py-3 backdrop-blur-sm">
                    <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.14em] text-text-secondary">{a.label}</span>
                    <span className="display-xs font-daltown text-brand">{a.value}</span>
                    <span className="font-[family-name:var(--font-display)] text-body-s text-content-secondary">{a.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Activations, captioned brand · festival · year */}
      <section id="cases" className="relative scroll-mt-24 py-16 xl:py-20">
        <div className="shell flex flex-col gap-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="section-title max-w-[14ch] text-white" data-reveal="clip">{c.caseStudies.title}</h2>
            <p className="m-0 max-w-[420px] font-[family-name:var(--font-display)] text-body text-content-secondary">{c.caseStudies.intro}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {c.caseStudies.items.map((k) => (
              <figure key={k.brand} className="m-0 flex flex-col gap-4" data-reveal="up">
                <span className="relative block aspect-[4/5] w-full overflow-hidden">
                  <Image src={k.image} alt="" fill sizes="(min-width: 1024px) 410px, 100vw" className="object-cover" />
                  <figcaption className="absolute bottom-0 left-0 bg-bg-primary px-3 py-2 font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.12em] text-white">
                    {k.brand} · {k.festival} · [year]
                  </figcaption>
                </span>
                <div className="flex flex-col gap-2">
                  <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-brand">{k.kind}</span>
                  <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
                    {k.experience} {k.todo ? <span className="text-brand/80">{k.todo}</span> : null}
                  </p>
                  <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-text-secondary">
                    {k.metrics.map((m) => `${m.value} ${m.note}`).join(" · ")}
                  </p>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* The report you get back */}
      <section className="relative bg-bg-secondary py-16 xl:py-20">
        <div className="shell grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_440px]">
          <div className="flex flex-col gap-6">
            <h2 className="section-title text-white" data-reveal="clip">{c.how.title}</h2>
            <ol className="m-0 flex list-none flex-col p-0">
              {c.how.steps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[48px_1fr] gap-4 border-t border-white/10 py-4">
                  <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex flex-col gap-1">
                    <span className="font-[family-name:var(--font-display)] text-title-body font-bold uppercase text-white">{s.title}</span>
                    <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          {/* the report, as a sheet */}
          <div className="relative -rotate-1 bg-[#f4f1ea] p-8 text-[#0b0b0e] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            <span aria-hidden className="absolute left-1/2 top-0 block h-[24px] w-[110px] -translate-x-1/2 -translate-y-1/2 rotate-2 bg-[rgba(217,217,217,0.5)]" />
            <p className="m-0 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[0.16em] text-black/55">After the festival</p>
            <p className="card-title mt-2">Your report</p>
            <dl className="m-0 mt-6 flex flex-col">
              {[
                ["Attendance at your space", "[XX,XXX]"],
                ["Qualified leads", "[XXX]"],
                ["Media and social reach", "[X.X M]"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-t border-black/15 py-3">
                  <dt className="font-[family-name:var(--font-display)] text-body">{k}</dt>
                  <dd className="display-xs m-0 font-daltown">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Ask */}
      <section className="relative py-16 xl:py-20">
        <div className="shell flex flex-col items-center gap-6 text-center">
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-text-secondary">{c.trustedBy.title}: {c.trustedBy.brands.slice(0, 8).join(" · ")}</p>
          <h2 className="section-title max-w-[14ch] text-white">{c.form.title}</h2>
          <SponsorCtaButton className={CTA}><span className="relative z-10">{c.form.submit}</span></SponsorCtaButton>
        </div>
      </section>
    </>
  );
}
