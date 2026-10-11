"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { homeCopy } from "@/data/home";

/**
 * The window cut through MORE.
 *
 * It is a video slot. Give `heroCut.pill.video` a source in `data/home.ts`
 * and this plays it — muted, looped, inline and autoplaying, which is the one
 * form of autoplay browsers allow and the only one that belongs in a
 * headline: it is a moving picture, not the site's music, and the deck is
 * still the only thing that makes sound.
 *
 * Until footage lands it shows the still from the comp and moves it instead:
 * a slow push in with a drift across, reversing, so the hole reads as live
 * rather than as a photograph someone forgot to replace. Same intent as the
 * clip, no placeholder footage invented to stand in for one.
 *
 * Both paths stop dead for `prefers-reduced-motion`, where the still simply
 * sits there and a clip shows its poster frame.
 */
export function HeroPill() {
  const { pill } = homeCopy.heroCut;
  const inner = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      /* A clip that is allowed to loop is still motion. Hold the first
         frame and leave it. */
      video.current?.pause();
      return;
    }

    /* The still only. A clip carries its own movement and does not want a
       second one laid over it. */
    if (pill.video) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } })
        .fromTo(
          el,
          { scale: 1.06, xPercent: -1.5, yPercent: 1 },
          { scale: 1.18, xPercent: 1.5, yPercent: -1, duration: 14 },
        );
    }, el);

    return () => ctx.revert();
  }, [pill.video]);

  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-full bg-white"
      style={{
        width: `${pill.width}em`,
        height: `${pill.height}em`,
        marginInlineStart: `${pill.gapBefore}em`,
        marginInlineEnd: `${pill.gapAfter}em`,
      }}
    >
      {/* The moving layer. Separate from the clipping shell so the pill's
          own edge never moves — only what is inside it does. */}
      <div ref={inner} className="absolute inset-0 will-change-transform">
        {pill.video ? (
          <video
            ref={video}
            src={pill.video}
            poster={pill.poster}
            autoPlay
            muted
            loop
            playsInline
            /* Decorative: the heading carries the words. */
            aria-hidden
            className="size-full object-cover"
          />
        ) : (
          <Image
            src={pill.src}
            alt={pill.alt}
            fill
            /* The hole is 455/1512 of the frame — a shade under a third of
               the viewport, and never more than the comp's own width. */
            sizes="(min-width: 1512px) 455px, 30vw"
            priority
            className="object-cover"
          />
        )}
      </div>
    </span>
  );
}
