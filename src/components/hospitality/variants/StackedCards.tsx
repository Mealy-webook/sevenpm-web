"use client";

import Link from "next/link";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction T — the stack.
 *
 * Each package sticks as it reaches the top and the next one slides over it,
 * so the set deals itself into a pile as you scroll. The pile is the point:
 * it says "there are five of these" in a way a column of cards never does,
 * and the one you are reading is always whole.
 *
 * Done with `position: sticky` and nothing else — no scroll listener, no
 * observer, no library. Each card sticks at a slightly lower offset than the
 * one before, which is what leaves the edge of every previous card showing
 * instead of burying them.
 *
 * Sticky stacking needs the cards to be siblings in a tall parent with no
 * `overflow` clipping anywhere above them, which is why this section sets no
 * overflow of its own.
 *
 * Below `lg` the stack unstacks into a plain column: stacking depends on
 * there being more viewport than card, and on a phone there is not.
 */
export function StackedCards() {
  const { eyebrow, title, from, discover } = hospitalityCopy.packages;

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-brand">
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
        </div>

        <div className="flex flex-col gap-6 lg:gap-0">
          {hospitalityPackages.map((entry, index) => (
            <article
              key={entry.slug}
              /* Each one sticks 18px lower than the last, so the top edge of
                 every card it covers stays visible. */
              className="lg:sticky"
              style={{ top: `calc(7rem + ${index * 18}px)` }}
            >
              <div
                className="flex flex-col overflow-hidden border border-white/12 bg-ink-900 shadow-[0_-12px_40px_rgba(0,0,0,0.5)] lg:h-[460px] lg:flex-row"
                style={{ borderRadius: "var(--radius)" }}
              >
                <PhotoSlot
                  caption={entry.photo}
                  src={entry.image}
                  rounded={false}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="h-[200px] w-full shrink-0 lg:h-full lg:w-[45%]"
                />

                <div className="flex flex-1 flex-col gap-4 p-6 xl:p-10">
                  <span className="font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[3px] text-brand">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(hospitalityPackages.length).padStart(2, "0")} ·{" "}
                    {entry.festival}
                  </span>

                  <h3 className="display-s m-0 font-daltown uppercase text-white">
                    {entry.name}
                  </h3>

                  <p className="m-0 max-w-[460px] font-[family-name:var(--font-ui)] text-body text-content-secondary">
                    {entry.summary}
                  </p>

                  <dl className="m-0 grid grid-cols-2 gap-x-8">
                    {entry.specs.slice(0, 2).map((spec) => (
                      <div
                        key={spec.label}
                        className="flex flex-col gap-0.5 border-t border-white/10 py-2.5"
                      >
                        <dt className="m-0 font-[family-name:var(--font-ui)] text-body-s text-white/45">
                          {spec.label}
                        </dt>
                        <dd className="m-0 font-[family-name:var(--font-display)] text-body font-semibold text-white">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto flex flex-wrap items-end gap-6 border-t border-white/10 pt-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-[family-name:var(--font-ui)] text-body-s text-white/45">
                        {from}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-title-body font-black text-brand">
                        {entry.price}
                      </span>
                      <span className="font-[family-name:var(--font-ui)] text-body-s text-white/45">
                        {entry.perUnit}
                      </span>
                    </div>
                    <Link
                      href={`/hospitality/${entry.slug}`}
                      className="sweep flex items-center bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-body font-semibold text-[#0b0b0e]"
                    >
                      <span className="relative z-10">{discover}</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* The scroll each card needs to be read before the next one
                  covers it. Nothing is in it; it only buys distance. */}
              <span aria-hidden className="hidden h-[70svh] lg:block" />
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
