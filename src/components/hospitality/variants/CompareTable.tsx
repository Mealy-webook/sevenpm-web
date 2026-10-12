"use client";

import Link from "next/link";
import { useState } from "react";

import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction F — the comparison.
 *
 * The packages as one wide table, every option against every other, because
 * the person buying hospitality is comparing: how many guests, how many
 * nights, how much, what is in it. The other five directions all make that
 * comparison by scrolling and remembering.
 *
 * The plainest of the six and the only one that is more useful the less
 * photography exists. It is a real `<table>` — the content is tabular, and a
 * grid of divs here would be unreadable to a screen reader and uncopyable
 * into the spreadsheet this audience will inevitably paste it into.
 *
 * Inclusions are pooled across the packages so the rows line up: a tick where
 * a package has one, a dash where it does not. A package whose inclusions are
 * still unwritten shows dashes, which is honest — it is what the data says.
 */

/** Every inclusion any package names, in first-seen order. */
function inclusionRows() {
  const seen: string[] = [];
  for (const entry of hospitalityPackages) {
    for (const line of entry.included) {
      if (!seen.includes(line)) seen.push(line);
    }
  }
  return seen;
}

export function CompareTable() {
  const { eyebrow, title, filters, from, discover } = hospitalityCopy.packages;
  const [filter, setFilter] = useState(filters[0]);

  const shown = hospitalityPackages.filter(
    (entry) => filter === "All" || entry.festival === filter,
  );
  const rows = inclusionRows();

  const cell = "border-b border-white/10 px-4 py-4 align-top";
  const head =
    "border-b border-white/20 px-4 py-4 text-left align-bottom font-[family-name:var(--font-display)]";

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

        {/* Scrolls sideways rather than reflowing: a comparison that stacks
            into five separate lists is no longer a comparison. */}
        <div className="-mx-[var(--shell-gutter)] overflow-x-auto px-[var(--shell-gutter)]">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <caption className="sr-only">
              SEVENPM hospitality packages compared by festival, capacity,
              price and what each one includes.
            </caption>
            <thead>
              <tr>
                <th scope="col" className={`${head} w-[190px]`}>
                  <span className="text-[12px] font-bold uppercase leading-4 tracking-[1.56px] text-white/45">
                    Package
                  </span>
                </th>
                {shown.map((entry) => (
                  <th key={entry.slug} scope="col" className={head}>
                    <span className="block font-daltown text-[23px] uppercase leading-[0.95] text-white">
                      {entry.name}
                    </span>
                    <span className="mt-1 block text-[12px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand">
                      {entry.festival}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="font-[family-name:var(--font-ui)] text-[14px] leading-[1.6]">
              <tr>
                <th scope="row" className={`${cell} font-semibold text-white/45`}>
                  Capacity
                </th>
                {shown.map((entry) => (
                  <td key={entry.slug} className={`${cell} text-white`}>
                    {entry.capacity}
                  </td>
                ))}
              </tr>

              <tr>
                <th scope="row" className={`${cell} font-semibold text-white/45`}>
                  Price
                </th>
                {shown.map((entry) => (
                  <td key={entry.slug} className={cell}>
                    <span className="block font-[family-name:var(--font-display)] text-[18px] font-black leading-6 text-brand">
                      {from} {entry.price}
                    </span>
                    <span className="block text-[13px] leading-5 text-white/45">
                      {entry.perUnit}
                    </span>
                  </td>
                ))}
              </tr>

              {rows.map((line) => (
                <tr key={line}>
                  <th
                    scope="row"
                    className={`${cell} font-semibold text-white/45`}
                  >
                    {line}
                  </th>
                  {shown.map((entry) => {
                    const has = entry.included.includes(line);
                    return (
                      <td key={entry.slug} className={cell}>
                        <span
                          className={has ? "text-brand" : "text-white/25"}
                          /* The tick carries meaning, so it is announced
                             rather than left as a bare glyph. */
                          role="img"
                          aria-label={has ? "Included" : "Not included"}
                        >
                          {has ? "✓" : "—"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr>
                <td className="px-4 py-5" />
                {shown.map((entry) => (
                  <td key={entry.slug} className="px-4 py-5">
                    <Link
                      href={`/hospitality/${entry.slug}`}
                      className="sweep inline-flex items-center bg-brand px-4 py-3 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-[#0b0b0e]"
                    >
                      <span className="relative z-10">{discover}</span>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-[1.6] text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
