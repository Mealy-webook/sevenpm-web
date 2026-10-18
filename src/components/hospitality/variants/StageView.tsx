"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction K — the view from the seat.
 *
 * One picture, pinned, and the packages scroll past it: as each one reaches
 * the middle of the screen the picture cross-fades to what that package
 * actually looks out on. Scrolling becomes moving between positions in the
 * room, which is what choosing between a box, a terrace and a garden really
 * is.
 *
 * Driven by an IntersectionObserver with a band through the middle of the
 * viewport rather than by scroll arithmetic — the browser does the work, it
 * costs nothing on a slow device, and there is no listener to throttle.
 *
 * Below `lg` the pinned picture is dropped and each package carries its own,
 * because a sticky half-screen image on a phone leaves no room for the thing
 * it is illustrating.
 */
export function StageView() {
  const { eyebrow, title, from, discover } = hospitalityCopy.packages;
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    /* A thin band across the middle: a row is "the one you are looking at"
       only while it crosses the centre line. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = rows.current.indexOf(entry.target as HTMLElement);
          if (index !== -1) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const row of rows.current) {
      if (row) observer.observe(row);
    }
    return () => observer.disconnect();
  }, []);

  const current = hospitalityPackages[active];

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
          <p className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-body text-content-secondary">
            Scroll, and the view changes to whatever your party would be
            looking at.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-14">
          {/* The pinned view. */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div
                className="relative aspect-[4/5] w-full overflow-hidden"
                style={{ borderRadius: "var(--radius)" }}
              >
                {hospitalityPackages.map((entry, index) => (
                  <div
                    key={entry.slug}
                    /* All of them stacked, only one opaque: a cross-fade,
                       rather than swapping the src and flashing. */
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === active ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden={index !== active}
                  >
                    <PhotoSlot
                      caption={entry.photo}
                      src={entry.image}
                      rounded={false}
                      sizes="460px"
                      className="size-full"
                    />
                  </div>
                ))}

                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 block bg-[linear-gradient(to_top,rgba(11,11,14,0.8),transparent_40%)]"
                />

                <p className="absolute bottom-5 left-5 m-0 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[3px] text-brand">
                  The view from {current.name}
                </p>
              </div>
            </div>
          </div>

          {/* The packages, passing it. */}
          <div className="flex flex-col">
            {hospitalityPackages.map((entry, index) => (
              <article
                key={entry.slug}
                ref={(node) => {
                  rows.current[index] = node;
                }}
                /* Full class names on both branches. Interpolating after the
                   variant — `lg:${cond ? "opacity-100" : "opacity-45"}` —
                   builds the right string at runtime but never writes it in
                   the source, and Tailwind generates utilities by scanning
                   source text, so neither rule would have existed. */
                className={`flex flex-col gap-4 border-t border-white/10 py-9 transition-opacity duration-500 xl:py-12 ${
                  index === active ? "lg:opacity-100" : "lg:opacity-45"
                }`}
              >
                {/* Its own picture below `lg`, where there is no pinned one. */}
                <PhotoSlot
                  caption={entry.photo}
                  src={entry.image}
                  sizes="100vw"
                  className="aspect-[3/2] w-full lg:hidden"
                />

                <span className="font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[3px] text-brand">
                  {String(index + 1).padStart(2, "0")} · {entry.festival}
                </span>

                <h3 className="display-s m-0 font-daltown uppercase text-white">
                  {entry.name}
                </h3>

                <p className="m-0 max-w-[520px] font-[family-name:var(--font-ui)] text-body text-content-secondary">
                  {entry.summary}
                </p>

                <div className="flex flex-wrap items-end gap-6 pt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-[family-name:var(--font-ui)] text-body-s text-white/45">
                      {from}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-title-body font-black text-brand">
                      {entry.price}
                    </span>
                    <span className="font-[family-name:var(--font-ui)] text-body-s text-white/45">
                      {entry.perUnit} · {entry.capacity}
                    </span>
                  </div>
                  <Link
                    href={`/hospitality/${entry.slug}`}
                    className="sweep flex items-center bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-body font-semibold text-[#0b0b0e]"
                  >
                    <span className="relative z-10">{discover}</span>
                  </Link>
                </div>
              </article>
            ))}
            <span className="block border-t border-white/10" />
          </div>
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-body-s text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
