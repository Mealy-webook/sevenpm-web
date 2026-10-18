"use client";

import Link from "next/link";
import { useState } from "react";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * "Choose your experience" — the package grid with its festival filter.
 *
 * Client-side because of the filter. The cards are plain links underneath, so
 * a package is reachable without JavaScript; only the narrowing needs it.
 */
export function PackageGrid() {
  const { eyebrow, title, filters, discover, from } = hospitalityCopy.packages;
  const [filter, setFilter] = useState(filters[0]);

  const shown = hospitalityPackages.filter(
    (entry) => filter === "All" || entry.festival === filter,
  );

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4">
            <p
              className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-brand"
              data-reveal="up"
            >
              {eyebrow}
            </p>
            <DisplayHeading align="left" reveal="clip" size="faq">
              {title}
            </DisplayHeading>
          </div>

          <div
            role="group"
            aria-label="Filter packages by festival"
            className="flex flex-wrap gap-2"
          >
            {filters.map((name) => {
              const active = name === filter;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(name)}
                  className={`border px-4 py-2.5 font-[family-name:var(--font-display)] text-body transition-colors ${
 active
 ? "border-brand bg-brand font-semibold text-[#18181b]"
 : "border-white/20 text-white/80 hover:border-white/50"
 }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {shown.map((entry) => (
            <article
              key={entry.slug}
              /* No `data-reveal` here, deliberately. MotionProvider sets the
                 from-state and builds the ScrollTriggers once, at mount; a
                 card that the filter brings back keeps the opacity:0 it was
                 given then and never plays, because its trigger was measured
                 against the unfiltered grid. A filter result should appear the
                 instant it is asked for in any case. */
              /* The mockup runs the Tanjazz card the full width at the foot of
                 the grid; `wide` keeps that without hard-coding a position. */
              className={`flex flex-col overflow-hidden border border-white/10 bg-ink-900 ${
                entry.wide ? "lg:col-span-2" : ""
              }`}
              style={{ borderRadius: "var(--radius)" }}
            >
              <PhotoSlot
                caption={entry.photo}
                rounded={false}
                className="min-h-[200px] w-full"
              />

              <div className="flex flex-1 flex-col gap-4 p-6 xl:p-7">
                <div className="flex flex-wrap gap-2">
                  <span
                    className="bg-white/10 px-3 py-1 font-[family-name:var(--font-display)] text-caption font-semibold text-white"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {entry.festival}
                  </span>
                  <span
                    className="bg-white/10 px-3 py-1 font-[family-name:var(--font-display)] text-caption font-semibold text-white/70"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {entry.capacity}
                  </span>
                </div>

                <h3 className="m-0 font-[family-name:var(--font-display)] text-title-section font-black text-white">
                  {entry.name}
                </h3>

                <p className="m-0 font-[family-name:var(--font-ui)] text-body text-content-secondary">
                  {entry.summary}
                </p>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-[family-name:var(--font-ui)] text-body-s text-white/45">
                      {from}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-title-section font-black text-brand">
                      {entry.price}
                    </span>
                    <span className="font-[family-name:var(--font-ui)] text-body-s text-white/45">
                      {entry.perUnit}
                    </span>
                  </div>
                  <Link
                    href={`/hospitality/${entry.slug}`}
                    className="sweep flex items-center bg-brand px-5 py-3 font-[family-name:var(--font-display)] text-body font-semibold text-[#0b0b0e]"
                  >
                    <span className="relative z-10">{discover}</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-body-s text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
