"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { homeCopy } from "@/data/home";
import { asset } from "@/lib/basePath";

/**
 * The hero's scroll reveal: the window in MORE opens into the reel.
 *
 * An earlier hero (2cc198c, 6fdedff) was a sticky screen whose frame opened
 * from a pill to the full bleed as you scrolled, playing the reel. It went
 * when the title it revealed did. The window cut through the O of MORE is
 * that pill, so the gesture comes back from there: scrolling grows the
 * window out of the word to fill the screen, MORE MUSIC fades away behind
 * it, the full-screen reel holds for a beat, and the page carries on.
 *
 * How it stays seamless: the window itself never moves. A stage sits over
 * the screen, starting at exactly the window's box with the same footage
 * cover-cropped the same way, synced to the window's playhead the moment it
 * takes over — so at the first pixel of scroll the hand-off is invisible.
 * The stage's box then interpolates to the screen's. The window's reel is
 * cut at 960 for the hole it plays in; the stage plays the 1920 cut of the
 * same film, loaded only where the stage can run.
 *
 * Desktop with motion only (the media query below, mirrored in CSS for the
 * track's height): on a phone a 280vh hero is a long way to scroll for one
 * picture, and reduced motion gets the hero as it was.
 */
const MEDIA = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function HeroScrollReveal({ children }: { children: React.ReactNode }) {
  const { pill } = homeCopy.heroCut;
  const track = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const stageVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = track.current;
    const sc = screen.current;
    const st = stage.current;
    const v = stageVideo.current;
    if (!t || !sc || !st) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA, () => {
        const win = sc.querySelector<HTMLElement>("[data-hero-pill]");
        const words = sc.querySelector<HTMLElement>(".hero-headline");
        if (!win) return;
        const winVideo = win.querySelector("video");

        /* The 1920 cut, fetched only here. */
        if (v && pill.stageVideo && !v.getAttribute("src")) {
          v.src = asset(pill.stageVideo);
          v.load();
        }

        /* The window's box within the screen. The words only fade, never
           scale, so this rect holds still at every point of the scrub. */
        const box = () => {
          const a = sc.getBoundingClientRect();
          const b = win.getBoundingClientRect();
          return {
            left: b.left - a.left,
            top: b.top - a.top,
            width: b.width,
            height: b.height,
          };
        };
        const headerH = () =>
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--header-h",
            ),
          ) || 0;

        let live = false;
        const takeOver = (on: boolean) => {
          if (on === live) return;
          live = on;
          if (!v) return;
          if (on) {
            if (winVideo) v.currentTime = winVideo.currentTime;
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        };

        gsap.set(st, { autoAlpha: 0 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: t,
            start: () => `top ${headerH()}px`,
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => takeOver(self.progress > 0.002),
          },
        });

        tl.set(st, { autoAlpha: 1 }, 0.002)
          .set(win, { autoAlpha: 0 }, 0.002)
          .fromTo(
            st,
            {
              left: () => box().left,
              top: () => box().top,
              width: () => box().width,
              height: () => box().height,
              borderRadius: 999,
            },
            {
              left: 0,
              top: 0,
              width: () => sc.clientWidth,
              height: () => sc.clientHeight,
              borderRadius: 0,
              ease: "power2.inOut",
              duration: 0.6,
            },
            0,
          )
          .to(words, { autoAlpha: 0, duration: 0.25, ease: "power1.in" }, 0.05)
          /* The hold: the full-screen reel, before the page moves on. */
          .to({}, { duration: 0.4 });

        return () => {
          takeOver(false);
          tl.scrollTrigger?.kill();
          tl.kill();
          /* Only what this timeline set. `clearProps: "all"` would also strip
             the inline width, height and margins React puts on the window —
             and React's dev double-mount runs this straight away, collapsing it. */
          gsap.set(st, { clearProps: "left,top,width,height,borderRadius" });
          gsap.set([win, words], { clearProps: "opacity,visibility" });
          gsap.set(st, { autoAlpha: 0 });
        };
      });
    }, t);

    return () => ctx.revert();
  }, [pill.stageVideo]);

  return (
    <div ref={track} className="hero-track relative">
      {/* Not overflow-hidden: the animated ground reaches up behind the
          header, and clipping here cut that band flat. */}
      <div ref={screen} className="hero-screen relative">
        {children}

        <div
          ref={stage}
          aria-hidden
          className="pointer-events-none invisible absolute z-20 overflow-hidden opacity-0"
        >
          {pill.video ? (
            <video
              ref={stageVideo}
              poster={asset(pill.poster)}
              muted
              loop
              playsInline
              preload="none"
              className="size-full object-cover"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
