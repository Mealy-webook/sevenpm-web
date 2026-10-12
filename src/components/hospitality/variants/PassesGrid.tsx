"use client";

import Link from "next/link";
import { useState } from "react";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction A — passes, not cards.
 *
 * Each package is a physical pass rather than a panel: a wide stub with the
 * picture on the left, the name in Daltown, and the price torn off down the
 * right behind a perforation. The notches are drawn as two columns of holes
 * punched out of the card, the same device the event page's ticket stubs use,
 * so hospitality reads as the premium end of the same ticketing rather than a
 * B2B page bolted onto the site.
 *
 * The flagship takes brand yellow and the rest stay dark, which is the
 * hierarchy the mockup's uniform grid had no way of showing.
 */
export function PassesGrid() {
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
            <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand">
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
                  className={`border px-4 py-2.5 font-[family-name:var(--font-display)] text-[14px] leading-5 transition-colors ${
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

        <div className="flex flex-col gap-5">
          {shown.map((entry, index) => {
            /* The first Jazzablanca pass is the flagship. Driven off position
               in the filtered list rather than a hard-coded slug, so the
               highlight follows whatever the filter is showing. */
            const lead = index === 0;
            return (
              <article
                key={entry.slug}
                className={`hosp-pass relative flex flex-col overflow-hidden lg:flex-row ${
                  lead ? "bg-brand text-[#18181b]" : "bg-ink-900 text-white"
                }`}
              >
                <PhotoSlot
                  caption={entry.photo}
                  src={entry.image}
                  rounded={false}
                  sizes="(min-width: 768px) 320px, 100vw"
                  className="h-[180px] w-full shrink-0 lg:h-auto lg:w-[260px] xl:w-[320px]"
                />

                <div className="flex flex-1 flex-col gap-3 p-6 xl:p-8">
                  <div className="flex flex-wrap gap-2">
                    {[entry.festival, entry.capacity].map((pill) => (
                      <span
                        key={pill}
                        className={`px-3 py-1 font-[family-name:var(--font-display)] text-[12px] font-semibold leading-5 ${
                          lead ? "bg-[#18181b]/10" : "bg-white/10"
                        }`}
                        style={{ borderRadius: "var(--radius)" }}
                      >
                        {pill}
                      </span>
                    ))}
                  </div>

                  <h3 className="m-0 font-daltown text-[clamp(25px,3.38vw,44px)] uppercase leading-[0.92]">
                    {entry.name}
                  </h3>

                  <p
                    className={`m-0 max-w-[520px] font-[family-name:var(--font-ui)] text-[14px] leading-[1.7] ${
                      lead ? "text-[#18181b]/70" : "text-content-secondary"
                    }`}
                  >
                    {entry.summary}
                  </p>
                </div>

                {/* The stub. Perforated off the body, the price inside it. */}
                <div
                  className={`hosp-stub flex shrink-0 flex-row items-center justify-between gap-4 p-6 lg:w-[230px] lg:flex-col lg:items-start lg:justify-center xl:p-8 ${
                    lead ? "text-[#18181b]" : "text-white"
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`font-[family-name:var(--font-ui)] text-[13px] leading-5 ${
                        lead ? "text-[#18181b]/60" : "text-white/45"
                      }`}
                    >
                      {from}
                    </span>
                    <span
                      className={`font-[family-name:var(--font-display)] text-[21px] font-black leading-7 ${
                        lead ? "text-[#18181b]" : "text-brand"
                      }`}
                    >
                      {entry.price}
                    </span>
                    <span
                      className={`font-[family-name:var(--font-ui)] text-[13px] leading-5 ${
                        lead ? "text-[#18181b]/60" : "text-white/45"
                      }`}
                    >
                      {entry.perUnit}
                    </span>
                  </div>

                  <Link
                    href={`/hospitality/${entry.slug}`}
                    className={`flex items-center px-5 py-3 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 transition-colors ${
                      lead
                        ? "bg-[#0b0b0e] text-white hover:bg-[#0b0b0e]/85"
                        : "bg-brand text-[#0b0b0e] hover:bg-white"
                    }`}
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {discover}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-[1.6] text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
