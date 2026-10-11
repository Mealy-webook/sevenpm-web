"use client";

import Link from "next/link";
import { useState } from "react";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction B — a type-led index.
 *
 * The packages are rows, not cards: the name at display size down the left,
 * and one picture on the right that swaps to whichever row is under the
 * cursor. The same device the About page uses for the four festivals, which
 * is why it already looks like this site.
 *
 * It is the direction that survives having no photography: a single picture
 * carries the whole section, so four missing shots cost four lines of type
 * rather than four empty boxes.
 *
 * Hover is an enhancement. The active row is also driven by focus, so the
 * index is navigable from the keyboard, and every row is a link in its own
 * right.
 */
export function PackageIndex() {
  const { eyebrow, title, from } = hospitalityCopy.packages;
  const [active, setActive] = useState(0);
  const current = hospitalityPackages[active];

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
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-14">
          <ul className="m-0 flex list-none flex-col p-0">
            {hospitalityPackages.map((entry, index) => {
              const on = index === active;
              return (
                <li key={entry.slug} className="border-t border-white/10">
                  <Link
                    href={`/hospitality/${entry.slug}`}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    className="group flex flex-col gap-2 py-6 transition-colors xl:py-7"
                  >
                    <span className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <span
                        className={`font-daltown text-[clamp(32px,5.5vw,76px)] uppercase leading-[0.9] transition-colors ${
                          on ? "text-brand" : "text-white"
                        }`}
                      >
                        {entry.name}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-[17px] font-bold leading-6 text-white/70">
                        {from} {entry.price}
                      </span>
                    </span>

                    <span className="flex flex-wrap items-center gap-x-4 gap-y-1 font-[family-name:var(--font-ui)] text-[14px] leading-6 text-content-secondary">
                      <span className="text-brand">{entry.festival}</span>
                      <span aria-hidden className="text-white/25">
                        ·
                      </span>
                      <span>{entry.capacity}</span>
                      <span aria-hidden className="text-white/25">
                        ·
                      </span>
                      <span>{entry.perUnit}</span>
                    </span>

                    {/* The summary belongs to the row the eye is on. On a
                        phone there is no hover, so every row keeps its own. */}
                    <span
                      className={`max-w-[560px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.7] text-content-secondary lg:transition-opacity ${
                        on ? "lg:opacity-100" : "lg:opacity-40"
                      }`}
                    >
                      {entry.summary}
                    </span>
                  </Link>
                </li>
              );
            })}
            <li className="border-t border-white/10" />
          </ul>

          {/* One picture for the whole index. Hidden below `lg`, where the
              rows are the entire section and a sticky image would be in the
              way rather than beside it. */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <PhotoSlot
                key={current.slug}
                caption={current.photo}
                src={current.image}
                sizes="420px"
                className="aspect-[3/4] w-full"
              />
              <p className="m-0 mt-4 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-white/45">
                {current.name}
              </p>
            </div>
          </div>
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.6] text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
