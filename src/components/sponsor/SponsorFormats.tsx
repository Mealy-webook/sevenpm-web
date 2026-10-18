"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { sponsorCopy } from "@/data/sponsor";
import { Eyebrow } from "./SponsorSections";

/**
 * "From logo to experience" — the five formats as one list you move
 * through, beside a picture of what each one looks like on the site.
 *
 * Each format is a ruled line: its number, its name in Daltown, and — on
 * the one you are on — its description and any link. Pointing at (or
 * focusing, or tapping) a line opens it and swaps the picture beside the
 * list, so five formats read as five scenes rather than five paragraphs.
 * The tailor-made invitation closes the list as a yellow line of its own.
 */
export function SponsorFormats() {
  const { eyebrow, title, intro, items, tailored } = sponsorCopy.formats;
  const [open, setOpen] = useState(0);
  const current = items[open] ?? items[0];

  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex flex-col gap-4">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="section-title text-white" data-reveal="clip">
              {title}
            </h2>
          </div>
          <p
            className="m-0 max-w-[460px] font-[family-name:var(--font-display)] text-body text-content-secondary"
            data-reveal="up"
          >
            {intro}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_520px] lg:gap-12">
          <ol className="m-0 list-none border-b border-white/10 p-0">
            {items.map((item, i) => {
              const on = i === open;
              return (
                <li key={item.title} className="border-t border-white/10">
                  <button
                    type="button"
                    onMouseEnter={() => setOpen(i)}
                    onFocus={() => setOpen(i)}
                    onClick={() => setOpen(i)}
                    aria-expanded={on}
                    className="group flex w-full items-baseline gap-6 py-5 text-left"
                  >
                    <span className={`font-[family-name:var(--font-display)] text-body font-semibold tabular-nums transition-colors ${on ? "text-brand" : "text-white/40"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`card-title font-daltown uppercase transition-colors duration-200 ${on ? "text-white" : "text-white/35 group-hover:text-white/70"}`}>
                      {item.title}
                    </span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="m-0 max-w-[52ch] pb-6 pl-[44px] font-[family-name:var(--font-display)] text-body text-content-secondary">
                        {item.body}
                        {item.link ? (
                          <>
                            {" "}
                            <Link href={item.link.href} className="text-brand underline underline-offset-2">
                              {item.link.label}
                            </Link>
                          </>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}

            {/* The invitation, as the list's last line. */}
            <li className="flex flex-col gap-4 bg-brand p-6 text-[#0b0b0e] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="display-xs m-0 font-daltown uppercase">{tailored.title}</h3>
                <p className="m-0 font-[family-name:var(--font-display)] text-body text-black/70">
                  {tailored.body}
                </p>
              </div>
              <Link
                href="#partnership-form"
                className="flex shrink-0 items-center bg-[#0b0b0e] px-5 py-3 font-[family-name:var(--font-display)] text-body font-semibold text-white transition-colors hover:bg-[#0b0b0e]/85"
              >
                {tailored.label} →
              </Link>
            </li>
          </ol>

          {/* The scene */}
          <div className="relative hidden aspect-[4/5] w-full overflow-hidden bg-ink-900 lg:sticky lg:top-28 lg:block lg:self-start">
            {items.map((item, i) => (
              <Image
                key={item.title}
                src={item.image}
                alt=""
                fill
                sizes="520px"
                className={`object-cover transition-[opacity,scale] duration-700 ease-out ${i === open ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
              />
            ))}
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <span className="display-xs font-daltown uppercase text-white">{current.title}</span>
              <span className="card-title font-daltown leading-none text-brand">
                {String(open + 1).padStart(2, "0")}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * "Four steps, one contact" — the steps as big numbered stages joined by a
 * line, read left to right: brief, proposal, co-creation, report.
 */
export function SponsorHow() {
  const { eyebrow, title, steps } = sponsorCopy.how;

  return (
    <section className="relative border-t border-white/10 bg-ink-900 py-16 xl:py-20">
      <div className="shell flex flex-col gap-10 xl:gap-12">
        <div className="flex flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="section-title text-white" data-reveal="clip">
            {title}
          </h2>
        </div>
        <ol className="relative m-0 grid list-none grid-cols-1 gap-10 p-0 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          <span aria-hidden className="absolute left-0 right-0 top-[44px] hidden h-px bg-white/15 xl:block" />
          {steps.map((step, index) => (
            <li key={step.title} data-reveal="up" className="relative flex flex-col gap-4">
              <span className="display-s relative z-10 flex size-[88px] items-center justify-center bg-brand font-daltown leading-none text-[#0b0b0e]">
                {index + 1}
              </span>
              <h3 className="card-title text-white">{step.title}</h3>
              <p className="m-0 max-w-[30ch] font-[family-name:var(--font-display)] text-body text-content-secondary">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
