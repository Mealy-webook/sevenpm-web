"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { READY_EVENT, introPending } from "@/components/motion/Preloader";
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
 * The window opens rather than appearing. It starts as a sliver on the
 * word's baseline and widens to full, which is the reveal the old hero frame
 * did at full-bleed scale before that rig was removed — the frame there
 * opened "from a rounded pill", and the pill is now where the hero lives, so
 * the gesture comes back at the size the comp draws rather than as a 320vh
 * scroll rig fighting a static hero.
 *
 * It waits for the preloader. `MotionProvider` holds the headline's own clip
 * reveal until `sevenpm:ready`, and a window that opened behind the loading
 * sheet would be over before the word it belongs to had arrived.
 *
 * Everything stops dead for `prefers-reduced-motion`: the window is simply
 * open, the still sits there, and a clip shows its poster frame.
 */
export function HeroPill() {
  const { pill } = homeCopy.heroCut;
  const shell = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = inner.current;
    const frame = shell.current;
    if (!el || !frame) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      /* A clip that is allowed to loop is still motion. Hold the first
         frame and leave it, with the window already open. */
      video.current?.pause();
      gsap.set(frame, { clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      /* The window, shut. Scaled on the x axis rather than animating width,
         so the letters either side never reflow while it opens. */
      gsap.set(frame, { scaleX: 0.06, transformOrigin: "50% 50%" });

      const open = () => {
        gsap.to(frame, {
          scaleX: 1,
          duration: 1.15,
          ease: "expo.out",
          delay: 0.12,
        });

        /* The clip starts as the window does, not on mount: a loop that has
           been running behind a closed shutter opens mid-phrase. */
        video.current?.play().catch(() => {
          /* Autoplay refused. It is muted and inline, so this is rare; the
             poster stands in and nothing else needs to happen. */
        });

        /* The still only. A clip carries its own movement and does not want
           a second one laid over it. */
        if (!pill.video) {
          gsap
            .timeline({
              repeat: -1,
              yoyo: true,
              defaults: { ease: "sine.inOut" },
            })
            .fromTo(
              el,
              { scale: 1.06, xPercent: -1.5, yPercent: 1 },
              { scale: 1.18, xPercent: 1.5, yPercent: -1, duration: 14 },
            );
        }
      };

      /* Behind the loader on a first visit; straight away on every other. */
      if (introPending()) {
        document.addEventListener(READY_EVENT, open, { once: true });
      } else {
        open();
      }
    }, frame);

    return () => ctx.revert();
  }, [pill.video]);

  return (
    <span
      ref={shell}
      /* HeroScrollReveal takes over from this box as the page scrolls. */
      data-hero-pill
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
            muted
            loop
            playsInline
            preload="auto"
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
