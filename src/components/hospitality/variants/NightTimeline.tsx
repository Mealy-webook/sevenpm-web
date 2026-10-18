"use client";

import Link from "next/link";
import { useState } from "react";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction H — the night, hour by hour.
 *
 * Hospitality is not a product, it is an evening, and the company is called
 * SEVENPM. So the section is a clock: doors at seven, through to the last
 * set, with the package chosen along the top and the night below it changing
 * to match.
 *
 * The hours come from the event's own session time (07:00 PM – 12:00 AM in
 * `data/events.ts`), so the spine is the real running order rather than an
 * invented one. What each package adds at each hour is written per package
 * where it is known and left honest where it is not.
 *
 * It sells the thing the other directions only list — what the evening is
 * actually like — and it is the only one that needs no photograph to work.
 */

/** The night, from the festival's own session time. */
const HOURS = [
  {
    time: "7 pm",
    title: "Doors",
    body: "Your guests arrive at a separate entrance, away from the main gate, and are met by name.",
  },
  {
    time: "8 pm",
    title: "Settled",
    body: "Drinks poured and food out. The first act is on and the site is filling up below you.",
  },
  {
    time: "10 pm",
    title: "The headline",
    body: "The set everyone came for, from a seat your party has had all evening.",
  },
  {
    time: "12 am",
    title: "Last call",
    body: "The site closes. Parking is on site, so nobody is hunting for a car at midnight.",
  },
];

export function NightTimeline() {
  const { eyebrow, title, from, discover } = hospitalityCopy.packages;
  const [active, setActive] = useState(0);
  const current = hospitalityPackages[active];

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-9">
        <div className="flex flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-brand">
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
          <p className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-body text-content-secondary">
            Doors at seven, last call at midnight. Pick the package and the
            night fills in underneath it.
          </p>
        </div>

        {/* The chooser. Packages across the top, because the night below is
            what changes. */}
        <div
          role="group"
          aria-label="Choose a package"
          className="flex flex-wrap gap-2"
        >
          {hospitalityPackages.map((entry, index) => {
            const on = index === active;
            return (
              <button
                key={entry.slug}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(index)}
                className={`border px-4 py-2.5 font-[family-name:var(--font-display)] text-body transition-colors ${
 on
 ? "border-brand bg-brand font-semibold text-[#18181b]"
 : "border-white/20 text-white/80 hover:border-white/50"
 }`}
              >
                {entry.name}
              </button>
            );
          })}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,340px)] lg:gap-14">
          {/* The night. A ruled spine with the hour on the left. */}
          <ol className="m-0 flex list-none flex-col p-0">
            {HOURS.map((hour) => (
              <li
                key={hour.time}
                className="relative flex gap-6 border-l border-white/15 pb-9 pl-7 last:pb-0 sm:gap-10 sm:pl-10"
              >
                {/* The marker sits on the spine. */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 block size-2.5 -translate-x-1/2 rounded-full bg-brand"
                />
                <div className="flex w-[72px] shrink-0 flex-col">
                  <span className="display-xs font-daltown uppercase text-brand">
                    {hour.time}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="m-0 font-[family-name:var(--font-display)] text-title-body font-bold text-white">
                    {hour.title}
                  </h3>
                  <p className="m-0 max-w-[520px] font-[family-name:var(--font-ui)] text-body text-content-secondary">
                    {hour.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* The package the night belongs to. */}
          <aside className="flex h-fit flex-col gap-4 lg:sticky lg:top-28">
            <PhotoSlot
              key={current.slug}
              caption={current.photo}
              src={current.image}
              sizes="340px"
              className="aspect-[4/3] w-full"
            />
            <h3 className="display-xs m-0 font-daltown uppercase text-white">
              {current.name}
            </h3>
            <p className="m-0 font-[family-name:var(--font-ui)] text-body text-content-secondary">
              {current.summary}
            </p>
            <div className="flex flex-col gap-0.5 border-t border-white/10 pt-4">
              <span className="font-[family-name:var(--font-ui)] text-body-s text-white/45">
                {from}
              </span>
              <span className="font-[family-name:var(--font-display)] text-title-section font-black text-brand">
                {current.price}
              </span>
              <span className="font-[family-name:var(--font-ui)] text-body-s text-white/45">
                {current.perUnit} · {current.capacity}
              </span>
            </div>
            <Link
              href={`/hospitality/${current.slug}`}
              className="sweep flex items-center self-start bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-body font-semibold text-[#0b0b0e]"
            >
              <span className="relative z-10">{discover}</span>
            </Link>
          </aside>
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-body-s text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
