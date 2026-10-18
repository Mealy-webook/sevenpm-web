"use client";

import Link from "next/link";
import { useState } from "react";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import {
  hospitalityCopy,
  hospitalityExtras,
  hospitalityPackages,
} from "@/data/hospitality";

/**
 * Direction L — the builder.
 *
 * Not a catalogue and not a recommendation: the visitor assembles the night.
 * Pick the space, pick what goes in it, and a running docket on the right
 * keeps the specification up to date.
 *
 * The difference from the concierge (direction J) is who decides. J asks
 * three questions and tells you the answer; this hands over the controls. It
 * suits the buyer who already knows what they want and resents being sold
 * to — which, for corporate hospitality, is most of them.
 *
 * No total is shown, on purpose. Every price in the data is a placeholder,
 * and a running total built out of placeholders would be the one number on
 * the page that looks authoritative and is not. The docket lists what has
 * been chosen and hands it to the quote form, which is what actually happens
 * next anyway — nothing here is bought online.
 */
export function NightBuilder() {
  const { eyebrow, from } = hospitalityCopy.packages;
  const [spaceIndex, setSpaceIndex] = useState(0);
  const [chosen, setChosen] = useState<string[]>(["catering"]);
  const space = hospitalityPackages[spaceIndex];

  const toggle = (id: string) =>
    setChosen((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-9">
        <div className="flex flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-brand">
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            Build your night
          </DisplayHeading>
          <p className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-body text-content-secondary">
            Choose the space, then what goes in it. We quote on what you
            build.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,340px)] lg:gap-14">
          <div className="flex flex-col gap-9">
            {/* Step one: the space. */}
            <div className="flex flex-col gap-4">
              <h3 className="m-0 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[3px] text-white/45">
                01 · The space
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {hospitalityPackages.map((entry, index) => {
                  const on = index === spaceIndex;
                  return (
                    <button
                      key={entry.slug}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSpaceIndex(index)}
                      className={`flex flex-col items-start gap-1 border p-4 text-left transition-colors ${
                        on
                          ? "border-brand bg-brand/10"
                          : "border-white/15 hover:border-white/40"
                      }`}
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      <span
                        className={`font-[family-name:var(--font-display)] text-body-l font-bold ${
 on ? "text-brand" : "text-white"
 }`}
                      >
                        {entry.name}
                      </span>
                      <span className="font-[family-name:var(--font-ui)] text-body-s text-content-secondary">
                        {entry.festival} · {entry.capacity}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-white/70">
                        {from} {entry.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step two: what goes in it. */}
            <div className="flex flex-col gap-4">
              <h3 className="m-0 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[3px] text-white/45">
                02 · What goes in it
              </h3>
              <ul className="m-0 flex list-none flex-col p-0">
                {hospitalityExtras.map((extra) => {
                  const on = chosen.includes(extra.id);
                  return (
                    <li key={extra.id} className="border-t border-white/10">
                      <label className="flex cursor-pointer items-start gap-4 py-4">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggle(extra.id)}
                          className="mt-1 size-4 shrink-0 accent-brand"
                        />
                        <span className="flex flex-1 flex-col gap-0.5">
                          <span className="flex flex-wrap items-baseline justify-between gap-3">
                            <span
                              className={`font-[family-name:var(--font-display)] text-body font-bold ${
 on ? "text-brand" : "text-white"
 }`}
                            >
                              {extra.label}
                            </span>
                            <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-white/55">
                              {extra.price}
                            </span>
                          </span>
                          <span className="font-[family-name:var(--font-ui)] text-body-s text-content-secondary">
                            {extra.note}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
                <li className="border-t border-white/10" />
              </ul>
            </div>
          </div>

          {/* The docket. */}
          <aside className="h-fit lg:sticky lg:top-28">
            <div
              className="flex flex-col gap-4 border border-white/15 bg-ink-900 p-6"
              style={{ borderRadius: "var(--radius)" }}
            >
              <PhotoSlot
                key={space.slug}
                caption={space.photo}
                src={space.image}
                sizes="340px"
                className="aspect-[3/2] w-full"
              />

              <h3 className="display-xs m-0 font-daltown uppercase text-white">
                {space.name}
              </h3>

              {/* Announced: the docket changes without the page moving. */}
              <dl aria-live="polite" className="m-0 flex flex-col">
                <div className="flex items-baseline justify-between gap-4 border-t border-white/10 py-2.5">
                  <dt className="m-0 font-[family-name:var(--font-ui)] text-body-s text-white/50">
                    Space
                  </dt>
                  <dd className="m-0 text-right font-[family-name:var(--font-display)] text-body-s font-semibold text-white">
                    {space.price}
                  </dd>
                </div>
                {hospitalityExtras
                  .filter((extra) => chosen.includes(extra.id))
                  .map((extra) => (
                    <div
                      key={extra.id}
                      className="flex items-baseline justify-between gap-4 border-t border-white/10 py-2.5"
                    >
                      <dt className="m-0 font-[family-name:var(--font-ui)] text-body-s text-white/50">
                        {extra.label}
                      </dt>
                      <dd className="m-0 text-right font-[family-name:var(--font-display)] text-body-s font-semibold text-white">
                        {extra.price}
                      </dd>
                    </div>
                  ))}
              </dl>

              {/* Why there is no total. Said on the page, not just in the
                  source: a docket that stops short of a number needs to
                  explain itself. */}
              <p className="m-0 border-t border-white/10 pt-4 font-[family-name:var(--font-ui)] text-body-s text-white/45">
                Prices are indicative and confirmed on the quote — so this
                docket lists what you have chosen rather than totalling it.
              </p>

              <Link
                href="#quote"
                className="sweep flex items-center justify-center bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-body font-semibold text-[#0b0b0e]"
              >
                <span className="relative z-10">Quote this night</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
