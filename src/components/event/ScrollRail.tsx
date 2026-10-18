"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * A horizontal rail that the page's own scroll drives.
 *
 * On desktop, as the rail travels up the screen, its track slides left by
 * exactly the distance it overhangs — from when the rail comes in at the
 * foot of the screen to when its top reaches the upper sixth, so the whole
 * slide plays while the cards are in view and the last one has arrived
 * without anyone reaching for a sideways scroll. It is scrubbed, not timed: it moves only while the page moves,
 * and backwards when the page does.
 *
 * Below `lg`, and whenever reduced motion is asked for, it is an ordinary
 * swipeable scroller — on a phone the sideways swipe is the natural
 * gesture, and a rail that moves by itself would fight it.
 *
 * The first child is the track. Everything else about the scroller (the
 * gutter padding, the bleed to the screen edge) is the caller's className.
 */
export function ScrollRail({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = viewport.current;
    const track = el?.firstElementChild as HTMLElement | null;
    if (!el || !track) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          /* How far the track overhangs: its content width, plus the
             scroller's gutter padding, past the scroller's box — so the
             last card stops level with the column. Measured from the
             cards' own edges, not from `scrollWidth` (thrown off by the
             track's transform, and it drops the end padding when the cards
             overflow a narrower track) or `offsetLeft` (which came out a
             gutter short here). Read at refresh, so a resize re-measures. */
          const overhang = () => {
            const cs = getComputedStyle(el);
            const first = track.firstElementChild;
            const last = track.lastElementChild;
            /* Edge to edge on screen: the track's transform moves both
               ends alike, so it cancels out of the difference. */
            const content =
              first && last
                ? last.getBoundingClientRect().right - first.getBoundingClientRect().left
                : 0;
            const room = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
            return Math.max(0, content - room);
          };

          /* GSAP owns the x now; the native scroller has to be off. */
          el.style.overflowX = "hidden";

          const tween = gsap.fromTo(
            track,
            { x: 0 },
            {
              x: () => -overhang(),
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "top 15%",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            },
          );

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
            el.style.overflowX = "";
            gsap.set(track, { x: 0 });
          };
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={viewport} className={className}>
      {children}
    </div>
  );
}
