"use client";

import Link from "next/link";
import { useState } from "react";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction G — the floorplan.
 *
 * The question behind every hospitality enquiry is "where will we be?", and
 * none of the other directions answers it. This one is a plan of the site
 * with the packages pinned where they actually sit: the box facing the
 * stage, the terraces above it, the garden behind, the pass at the gate.
 * Choosing a package becomes choosing a position.
 *
 * The plan is schematic rather than a survey — drawn from what each package
 * says about itself. A real site plan should replace it, at which point the
 * pins keep their percentages and land on the drawing instead.
 *
 * The pins are buttons over a figure, and the list beside them is the same
 * set in reading order. On a phone the plan goes and the list is the whole
 * section: a plan small enough for a phone is a diagram nobody can read.
 */
export function FloorPlan() {
  const { eyebrow, title, from, discover } = hospitalityCopy.packages;
  const [active, setActive] = useState(0);
  const current = hospitalityPackages[active];
  const pinned = hospitalityPackages.filter((entry) => entry.plan);

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand">
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
          <p className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.7] text-content-secondary">
            Where your party actually stands. Pick a position on the site and
            the package that holds it comes up beside the plan.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-12">
          {/* The plan. Hidden below `lg` — see the note above. */}
          <div
            className="relative hidden aspect-[4/3] w-full overflow-hidden border border-white/10 bg-ink-900 lg:block"
            style={{ borderRadius: "var(--radius)" }}
          >
            {/* Ground: a faint grid, so distances read as a plan rather than
                as a picture. */}
            <span
              aria-hidden
              className="absolute inset-0 block opacity-[0.17]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* The stage, at the top, with its throw across the ground. */}
            <span
              aria-hidden
              className="absolute left-1/2 top-[7%] block h-[7%] w-[46%] -translate-x-1/2 bg-brand"
              style={{ borderRadius: "var(--radius)" }}
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-[7%] block h-[62%] w-[88%] -translate-x-1/2 bg-[linear-gradient(to_bottom,rgba(251,235,28,0.16),transparent_78%)] [clip-path:polygon(28%_0,72%_0,100%_100%,0_100%)]"
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-[15.5%] -translate-x-1/2 font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[3px] text-brand/80"
            >
              Main stage
            </span>

            {pinned.map((entry) => {
              const index = hospitalityPackages.indexOf(entry);
              const on = index === active;
              return (
                <button
                  key={entry.slug}
                  type="button"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  aria-pressed={on}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${entry.plan!.x}%`, top: `${entry.plan!.y}%` }}
                >
                  <span
                    className={`flex items-center gap-2 border px-3 py-2 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 transition-colors ${
                      on
                        ? "border-brand bg-brand text-[#18181b]"
                        : "border-white/25 bg-[#0b0b0e]/85 text-white hover:border-white/60"
                    }`}
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    <span
                      aria-hidden
                      className={`block size-2 rounded-full ${
                        on ? "bg-[#18181b]" : "bg-brand"
                      }`}
                    />
                    {entry.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* The list: the plan in reading order, and the whole section on a
              phone. */}
          <div className="flex flex-col gap-5">
            <div className="hidden lg:block">
              <PhotoSlot
                key={current.slug}
                caption={current.photo}
                src={current.image}
                sizes="380px"
                className="aspect-[4/3] w-full"
              />
            </div>

            <ul className="m-0 flex list-none flex-col p-0">
              {hospitalityPackages.map((entry, index) => {
                const on = index === active;
                return (
                  <li key={entry.slug} className="border-t border-white/10">
                    <Link
                      href={`/hospitality/${entry.slug}`}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      className="flex flex-col gap-1 py-4"
                    >
                      <span className="flex items-baseline justify-between gap-4">
                        <span
                          className={`font-[family-name:var(--font-display)] text-[17px] font-bold leading-6 transition-colors ${
                            on ? "text-brand" : "text-white"
                          }`}
                        >
                          {entry.name}
                        </span>
                        <span className="shrink-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 text-white/60">
                          {from} {entry.price}
                        </span>
                      </span>
                      <span className="font-[family-name:var(--font-ui)] text-[13px] leading-[1.6] text-content-secondary">
                        {entry.capacity} · {entry.perUnit}
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li className="border-t border-white/10" />
            </ul>

            <Link
              href={`/hospitality/${current.slug}`}
              className="sweep flex items-center self-start bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-[#0b0b0e]"
            >
              <span className="relative z-10">
                {discover} {current.name}
              </span>
            </Link>
          </div>
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-[1.6] text-white/45">
          {hospitalityCopy.priceNote} The plan is schematic.
        </p>
      </div>
    </section>
  );
}
