"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { sponsorCopy } from "@/data/sponsor";
import { SponsorCtaButton } from "../SponsorDialog";

/**
 * B · Stage — the pitch as a film.
 *
 * One full-screen photograph sits behind the whole page and changes with
 * each chapter as it scrolls past: the stage for the pitch, the crowd for
 * the numbers and the audience, each partner's own scene for its case, the
 * format you are pointing at, the boxes for how it works. The words come
 * in on glass panels over the picture, so the page is always showing what
 * it is talking about. A chapter index down the right keeps your place.
 * Every call to action opens the enquiry as a pop-up.
 */
const CTA =
  "sweep inline-flex items-center bg-brand px-6 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e] after:!bg-white";
const PANEL = "w-full max-w-[620px] border border-white/10 bg-black/55 p-6 backdrop-blur-md xl:p-8";
const EYEBROW =
  "m-0 font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.16em] text-brand";

export function SponsorStage() {
  const c = sponsorCopy;
  const chapters = [
    { id: "pitch", label: "The pitch", image: c.heroImage },
    { id: "reach", label: "The reach", image: "/assets/gallery-3.jpg" },
    { id: "audience", label: "The audience", image: c.audience.image },
    ...c.caseStudies.items.map((k) => ({ id: `case-${k.brand}`, label: k.brand, image: k.image })),
    { id: "formats", label: "Formats", image: c.formats.items[0].image },
    { id: "how", label: "How it works", image: "/assets/hosp-vip-box.jpg" },
  ];
  const [active, setActive] = useState(0);
  const [formatImage, setFormatImage] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    root.current?.querySelectorAll("[data-index]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const formatsIndex = chapters.findIndex((ch) => ch.id === "formats");
  const shown = active === formatsIndex && formatImage ? formatImage : chapters[active].image;
  const pictures = [...new Set([...chapters.map((ch) => ch.image), ...c.formats.items.map((f) => f.image)])];

  return (
    <div ref={root} className="relative">
      {/* The picture behind everything */}
      <div aria-hidden className="sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden">
        {pictures.map((src) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="100vw"
            priority={src === c.heroImage}
            className={`object-cover transition-[opacity,scale] duration-[1200ms] ease-out ${src === shown ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
          />
        ))}
        <span className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20" />
      </div>

      {/* Chapter index */}
      <nav aria-label="Chapters" className="pointer-events-none fixed right-[var(--shell-gutter)] top-1/2 z-20 hidden -translate-y-1/2 xl:block">
        <ol className="m-0 flex list-none flex-col items-end gap-3 p-0">
          {chapters.map((ch, i) => (
            <li key={ch.id} className="flex items-center gap-3">
              <span className={`font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.12em] transition-opacity ${i === active ? "text-white opacity-100" : "text-white opacity-0"}`}>
                {ch.label}
              </span>
              <span className={`block h-px transition-[width,background-color] duration-300 ${i === active ? "w-10 bg-brand" : "w-4 bg-white/40"}`} />
            </li>
          ))}
        </ol>
      </nav>

      <div className="relative z-10">
        {/* 1 · The pitch */}
        <section data-index={0} className="flex min-h-[100svh] items-end pb-16 pt-32">
          <div className="shell flex flex-col gap-6">
            <p className={EYEBROW}>{c.eyebrow}</p>
            <h1 className="display-text max-w-[12ch] text-white" data-reveal="clip">{c.title}</h1>
            <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-body-l text-content-primary">{c.intro}</p>
            <div className="flex flex-wrap gap-3">
              <SponsorCtaButton className={CTA}><span className="relative z-10">Become a sponsor</span></SponsorCtaButton>
            </div>
            <p className="m-0 mt-6 max-w-[900px] font-[family-name:var(--font-display)] text-body-s uppercase tracking-[0.12em] text-white/60">
              <span className="text-brand">{c.trustedBy.title} · </span>
              {c.trustedBy.brands.join(" · ")}
            </p>
          </div>
        </section>

        {/* 2 · The reach */}
        <section data-index={1} className="flex min-h-[100svh] items-center py-24">
          <div className="shell">
            <div className={PANEL}>
              <p className={EYEBROW}>The reach</p>
              <dl className="m-0 mt-6 grid grid-cols-2 gap-x-6 gap-y-8">
                {c.stats.map((s) => (
                  <div key={s.note} className="flex flex-col gap-1">
                    <dt className={`card-title ${s.accent ? "text-brand" : "text-white"}`}>{s.value}</dt>
                    <dd className="m-0 font-[family-name:var(--font-display)] text-body-s text-content-secondary">{s.note}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* 3 · The audience */}
        <section data-index={2} className="flex min-h-[100svh] items-center py-24">
          <div className="shell">
            <div className={PANEL}>
              <p className={EYEBROW}>{c.audience.eyebrow}</p>
              <h2 className="section-title mt-3 text-white">{c.audience.title}</h2>
              <dl className="m-0 mt-6 grid grid-cols-2 gap-x-6 gap-y-6">
                {c.audience.cards.map((a) => (
                  <div key={a.label} className="flex flex-col gap-1 border-t border-white/15 pt-3">
                    <dt className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.12em] text-text-secondary">{a.label}</dt>
                    <dd className="m-0 display-s font-daltown text-brand">{a.value}</dd>
                    <dd className="m-0 font-[family-name:var(--font-display)] text-body-s text-white/55">{a.note}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* 4–6 · Each case, a chapter */}
        {c.caseStudies.items.map((k, i) => (
          <section key={k.brand} data-index={3 + i} className="flex min-h-[100svh] items-center py-24">
            <div className="shell">
              <article className={PANEL}>
                <p className={EYEBROW}>
                  {c.caseStudies.eyebrow} · {String(i + 1).padStart(2, "0")} / {String(c.caseStudies.items.length).padStart(2, "0")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="bg-brand px-3 py-1 font-[family-name:var(--font-display)] text-caption font-bold text-[#0b0b0e]">{k.kind}</span>
                  <span className="bg-white/10 px-3 py-1 font-[family-name:var(--font-display)] text-caption font-bold text-content-primary">{k.festival}</span>
                </div>
                <h2 className="display-m mt-4 font-daltown uppercase text-white">{k.brand}</h2>
                <p className="m-0 mt-3 font-[family-name:var(--font-display)] text-body text-content-secondary">
                  <strong className="text-white">The experience:</strong> {k.experience}{" "}
                  {k.todo ? <span className="text-brand/80">{k.todo}</span> : null}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {k.metrics.map((m) => (
                    <div key={m.note} className="bg-white/5 p-4">
                      <p className="m-0 display-s font-daltown text-brand">{m.value}</p>
                      <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-content-secondary">{m.note}</p>
                    </div>
                  ))}
                </div>
                <p className="m-0 mt-4 font-[family-name:var(--font-display)] text-caption uppercase tracking-[0.12em] text-white/40">Stand-in photo</p>
              </article>
            </div>
          </section>
        ))}

        {/* 7 · Formats — the picture follows the format you point at */}
        <section data-index={formatsIndex} className="flex min-h-[100svh] items-center py-24">
          <div className="shell">
            <div className={`${PANEL} max-w-[720px]`}>
              <p className={EYEBROW}>{c.formats.eyebrow}</p>
              <h2 className="section-title mt-3 text-white">{c.formats.title}</h2>
              <ol className="m-0 mt-6 list-none p-0">
                {c.formats.items.map((f, i) => (
                  <li
                    key={f.title}
                    onMouseEnter={() => setFormatImage(f.image)}
                    onFocus={() => setFormatImage(f.image)}
                    tabIndex={0}
                    className="group flex flex-col gap-1 border-t border-white/10 py-4 outline-none focus-visible:bg-white/5"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                      <span className="display-xs font-daltown uppercase text-white transition-colors group-hover:text-brand">{f.title}</span>
                    </span>
                    <span className="pl-9 font-[family-name:var(--font-display)] text-body-s text-content-secondary">{f.body}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 bg-brand p-5 text-[#0b0b0e]">
                <div>
                  <p className="m-0 display-xs font-daltown uppercase">{c.formats.tailored.title}</p>
                  <p className="m-0 font-[family-name:var(--font-display)] text-body-s">{c.formats.tailored.body}</p>
                </div>
                <SponsorCtaButton className="bg-[#0b0b0e] px-5 py-3 font-[family-name:var(--font-display)] text-body font-semibold text-white">
                  {c.formats.tailored.label} →
                </SponsorCtaButton>
              </div>
            </div>
          </div>
        </section>

        {/* 8 · How it works, then the ask */}
        <section data-index={formatsIndex + 1} className="flex min-h-[100svh] items-center py-24">
          <div className="shell flex flex-col gap-8">
            <div className={`${PANEL} max-w-[900px]`}>
              <p className={EYEBROW}>{c.how.eyebrow}</p>
              <h2 className="section-title mt-3 text-white">{c.how.title}</h2>
              <ol className="m-0 mt-6 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2">
                {c.how.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center bg-brand display-xs font-daltown text-[#0b0b0e]">{i + 1}</span>
                    <span className="flex flex-col gap-1">
                      <span className="font-[family-name:var(--font-display)] text-title-body font-bold text-white">{s.title}</span>
                      <span className="font-[family-name:var(--font-display)] text-body-s text-content-secondary">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <h2 className="section-title text-white">{c.form.title}</h2>
              <SponsorCtaButton className={CTA}><span className="relative z-10">{c.form.submit} →</span></SponsorCtaButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
