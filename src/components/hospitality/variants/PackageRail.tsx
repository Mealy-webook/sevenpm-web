"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction O — the rail.
 *
 * The packages run sideways as tall cards you push along, the way the
 * homepage's festival row already moves. It takes one screen rather than
 * five, and the sideways motion makes the set feel like a programme to be
 * browsed rather than a list to be worked through.
 *
 * Native scrolling rather than a transform: a real overflow container keeps
 * trackpad, touch, shift-wheel, keyboard and the scrollbar all working for
 * free, and snaps each card into place. The arrows scroll it by one card for
 * anyone who would rather press something, and are hidden from assistive
 * tech because the rail itself is already reachable.
 */
export function PackageRail() {
  const { eyebrow, title, from, discover } = hospitalityCopy.packages;
  const rail = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);

  const nudge = (direction: -1 | 1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.getBoundingClientRect().width + 24 : 360;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

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

          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tabular-nums text-white/45">
              {String(at + 1).padStart(2, "0")} /{" "}
              {String(hospitalityPackages.length).padStart(2, "0")}
            </span>
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                aria-hidden
                tabIndex={-1}
                onClick={() => nudge(direction)}
                className="flex size-11 items-center justify-center border border-white/20 text-white transition-colors hover:border-white/60"
                style={{ borderRadius: "var(--radius)" }}
              >
                <span className="block text-[17px] leading-none">
                  {direction === -1 ? "‹" : "›"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full bleed, with the shell's gutter as padding, so the last card can
          reach the edge of the screen and the first still lines up with the
          heading above it. */}
      <div
        ref={rail}
        onScroll={(event) => {
          const el = event.currentTarget;
          const card = el.querySelector("article");
          const step = card ? card.getBoundingClientRect().width + 24 : 360;
          setAt(Math.round(el.scrollLeft / step));
        }}
        className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--shell-gutter)] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {hospitalityPackages.map((entry) => (
          <article
            key={entry.slug}
            className="relative flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden bg-ink-900 sm:w-[420px] xl:w-[460px]"
            style={{ borderRadius: "var(--radius)" }}
          >
            <PhotoSlot
              caption={entry.photo}
              src={entry.image}
              rounded={false}
              sizes="(min-width: 640px) 460px, 78vw"
              className="aspect-[4/5] w-full"
            />

            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 block bg-[linear-gradient(to_top,rgba(11,11,14,0.95),rgba(11,11,14,0.45)_42%,transparent_72%)]"
            />

            <div className="relative -mt-[42%] flex flex-col gap-3 p-6 xl:p-7">
              <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[3px] text-brand">
                {entry.festival} · {entry.capacity}
              </span>

              <h3 className="m-0 font-daltown text-[clamp(25px,3.39vw,39px)] uppercase leading-[0.9] text-white">
                {entry.name}
              </h3>

              <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.7] text-content-secondary">
                {entry.summary}
              </p>

              <div className="mt-2 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-4">
                <div className="flex flex-col gap-0.5">
                  <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                    {from}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[19px] font-black leading-7 text-brand">
                    {entry.price}
                  </span>
                  <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                    {entry.perUnit}
                  </span>
                </div>
                <Link
                  href={`/hospitality/${entry.slug}`}
                  className="sweep flex items-center bg-brand px-5 py-3 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-[#0b0b0e]"
                >
                  <span className="relative z-10">{discover}</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="shell mt-4">
        <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-[1.6] text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
