"use client";

import Link from "next/link";
import { useState } from "react";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction N — the accordion.
 *
 * Every package on one screen as a closed row, opening in place to its
 * picture, specification and inclusions. Nothing scrolls away to be
 * compared from memory, and nothing is behind a second page.
 *
 * The case for it is density. Of the thirteen directions this is the one
 * that puts the whole offer above the fold on a laptop, which matters for a
 * page people arrive at from an email with a specific question.
 *
 * One row opens at a time: this is a chooser, and two open rows push the
 * third off the screen, which is the problem the direction exists to solve.
 * The rows are buttons controlling a panel rather than `<details>`, because
 * closing a sibling is not something `<details>` does without being fought.
 */
export function PackageAccordion() {
  const { eyebrow, title, from, discover } = hospitalityCopy.packages;
  const [open, setOpen] = useState(0);

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand">
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
        </div>

        <ul className="m-0 flex list-none flex-col p-0">
          {hospitalityPackages.map((entry, index) => {
            const on = index === open;
            const panelId = `hosp-panel-${entry.slug}`;
            const headId = `hosp-head-${entry.slug}`;

            return (
              <li key={entry.slug} className="border-t border-white/12">
                <h3 className="m-0">
                  <button
                    id={headId}
                    type="button"
                    aria-expanded={on}
                    aria-controls={panelId}
                    onClick={() => setOpen(on ? -1 : index)}
                    className="flex w-full items-center gap-5 py-5 text-left"
                  >
                    <span
                      aria-hidden
                      className={`font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tabular-nums transition-colors ${
                        on ? "text-brand" : "text-white/35"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="flex flex-1 flex-wrap items-baseline gap-x-5 gap-y-1">
                      <span
                        className={`font-daltown text-[clamp(24px,3.6vw,44px)] uppercase leading-[0.92] transition-colors ${
                          on ? "text-brand" : "text-white"
                        }`}
                      >
                        {entry.name}
                      </span>
                      <span className="font-[family-name:var(--font-ui)] text-[14px] leading-6 text-content-secondary">
                        {entry.festival} · {entry.capacity}
                      </span>
                    </span>

                    <span className="hidden shrink-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 text-white/70 sm:block">
                      {from} {entry.price}
                    </span>

                    {/* A plus that becomes a minus. */}
                    <span
                      aria-hidden
                      className={`relative block size-5 shrink-0 transition-transform duration-300 ${
                        on ? "rotate-45" : ""
                      }`}
                    >
                      <span className="absolute left-0 top-1/2 block h-px w-full -translate-y-1/2 bg-brand" />
                      <span className="absolute left-1/2 top-0 block h-full w-px -translate-x-1/2 bg-brand" />
                    </span>
                  </button>
                </h3>

                {/* Grid-rows 0fr to 1fr animates a height the content
                    decides, which auto cannot. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headId}
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                    on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-7 pb-9 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-12">
                      <PhotoSlot
                        caption={entry.photo}
                        src={entry.image}
                        sizes="(min-width: 1024px) 380px, 100vw"
                        className="aspect-[3/2] w-full"
                      />

                      <div className="flex flex-col gap-5">
                        <p className="m-0 max-w-[520px] font-[family-name:var(--font-ui)] text-[16px] leading-[1.7] text-content-secondary">
                          {entry.body}
                        </p>

                        <dl className="m-0 grid grid-cols-2 gap-x-8">
                          {entry.specs.map((spec) => (
                            <div
                              key={spec.label}
                              className="flex flex-col gap-0.5 border-t border-white/10 py-2.5"
                            >
                              <dt className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                                {spec.label}
                              </dt>
                              <dd className="m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-5 text-white">
                                {spec.value}
                              </dd>
                            </div>
                          ))}
                        </dl>

                        {entry.included.length ? (
                          <ul className="m-0 flex list-none flex-col gap-2 p-0">
                            {entry.included.map((line) => (
                              <li
                                key={line}
                                className="flex items-start gap-3 font-[family-name:var(--font-ui)] text-[15px] leading-6 text-white"
                              >
                                <span aria-hidden className="text-brand">
                                  ✓
                                </span>
                                {line}
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        {entry.includedTodo ? (
                          <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.6] text-brand/75">
                            {entry.includedTodo}
                          </p>
                        ) : null}

                        <div className="flex flex-wrap items-end gap-5">
                          <div className="flex flex-col gap-0.5 sm:hidden">
                            <span className="font-[family-name:var(--font-display)] text-[20px] font-black leading-7 text-brand">
                              {from} {entry.price}
                            </span>
                            <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                              {entry.perUnit}
                            </span>
                          </div>
                          <Link
                            href={`/hospitality/${entry.slug}`}
                            className="sweep flex items-center bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 text-[#0b0b0e]"
                          >
                            <span className="relative z-10">{discover}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <li className="border-t border-white/12" />
        </ul>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.6] text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
