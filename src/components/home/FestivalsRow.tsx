"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import VinylAlbumCard from "@/components/ui/great-ui-vinyl-album-card";
import type { Festival } from "@/data/home";
import { festivalsRowOrder, homeCopy } from "@/data/home";

/**
 * "Our iconic festivals" — Figma 2482:25025.
 *
 * The comp replaces the perspective poster stage with a plain row: the title
 * at Daltown 152/118 on a 403 measure, then the artwork running off the right
 * edge of the page. Four fit the frame and the rest are past it, which is the
 * comp saying the row moves.
 *
 * So it moves with the page: the section pins and the track scrubs sideways
 * over exactly the distance it overhangs, then releases into the band below.
 * Vertical scrolling is the only input, which is what makes it work on a
 * trackpad, a wheel and a touch screen alike.
 *
 * Below `lg`, and whenever reduced motion is asked for, the pin is off and
 * the row is an ordinary horizontal scroller — a pinned section on a phone
 * hijacks the one gesture the reader has.
 *
 * The covers are square and each one is a sleeve with a record behind it
 * (`VinylAlbumCard`): hovering slides the record out and opens the caption
 * underneath. One card is active at a time, held here rather than in each
 * card, so two records are never half-out at once. The caption's height is
 * reserved whether or not it is showing, so the row does not jump.
 *
 * The artwork is the comp's own, re-cropped square from the bitmaps behind
 * it; the old perspective exports are not reused. Only the four festivals
 * that artwork covers are in the row.
 *
 * The spacebar audio preview the old stage carried does not come with it —
 * the comp draws no control for it and no hint. `FestivalsStage` still has
 * it, and the two homepage preview routes still use that.
 */

const CARD = 404;
const CAPTION = 64;

export function FestivalsRow({ festivals }: { festivals: Festival[] }) {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const cards = festivalsRowOrder
    .map((id) => festivals.find((f) => f.id === id))
    .filter((f): f is Festival => Boolean(f?.card));

  useEffect(() => {
    const sectionEl = section.current;
    const viewportEl = viewport.current;
    const trackEl = track.current;
    if (!sectionEl || !viewportEl || !trackEl) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          pinned:
            "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        },
        () => {
          /* How far the row overhangs the screen: the viewport's own
             scrollable distance, which counts the gutters, so the last
             cover ends level with the column instead of past it. Read at
             refresh rather than once, so a resize re-measures instead of
             scrubbing to a stale distance. */
          const overhang = () =>
            Math.max(0, viewportEl.scrollWidth - viewportEl.clientWidth);

          /* GSAP owns the x while it is pinned, so the native scroller has
             to be off — two mechanisms on one axis fight each other. */
          viewportEl.style.overflowX = "hidden";

          const tween = gsap.to(trackEl, {
            x: () => -overhang(),
            ease: "none",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top top",
              end: () => `+=${overhang()}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
            viewportEl.style.overflowX = "";
            gsap.set(trackEl, { x: 0 });
          };
        },
      );
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      id="festivals"
      aria-labelledby="festivals-title"
      className="relative flex min-h-svh flex-col justify-center py-16 xl:py-20"
    >
      <div
        ref={viewport}
        /* The gutter is padding rather than a margin so the title lines up
           with the column and the last cover can still reach the edge. */
        className="w-full overflow-x-auto px-[var(--shell-gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div ref={track} className="flex w-max items-start gap-8">
          <h2
            id="festivals-title"
            className="m-0 w-[403px] shrink-0 self-center font-daltown text-[clamp(64px,10vw,152px)] uppercase leading-[0.78] tracking-[0.03em] text-white"
            data-reveal="clip"
          >
            {homeCopy.festivalsTitle}
          </h2>

          {cards.map((festival) => {
            const active = activeId === festival.id;
            return (
              <Link
                key={festival.id}
                href={festival.href}
                aria-label={festival.name}
                data-cursor="Open"
                /* The record slides half a cover's width to the right, so
                   the active card has to sit above its neighbour. */
                className={`shrink-0 ${active ? "z-30" : "z-10"}`}
              >
                <VinylAlbumCard
                  coverImage={festival.card as string}
                  title={festival.name}
                  meta={festival.when}
                  size={CARD}
                  captionHeight={CAPTION}
                  active={active}
                  onActiveChange={(next) =>
                    setActiveId(next ? festival.id : null)
                  }
                  sizes={`${CARD}px`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
