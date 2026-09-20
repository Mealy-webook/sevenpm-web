"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * A line of words in the display face, drifting sideways on a loop — the
 * event page's line-up row, with words for faces. Two copies are laid out and
 * the track travels exactly the distance between them, so the loop has no
 * seam. It slows to a stop under the cursor and stops entirely off screen.
 *
 * Decorative: the words it shows are always written properly somewhere else
 * on the page, so it is hidden from assistive technology.
 */
export function WordMarquee({
  words,
  tone = "ghost",
  size = "xl",
  speed = 70,
  className = "",
}: {
  words: string[];
  /** `ghost` is a backdrop; `solid` is a headline. */
  tone?: "ghost" | "solid";
  size?: "xl" | "md" | "sm";
  /** Pixels per second. */
  speed?: number;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const key = words.join("|");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const track = el.querySelector<HTMLElement>("[data-track]");
      const first = track?.children[0] as HTMLElement | undefined;
      const second = track?.children[1] as HTMLElement | undefined;
      if (!track || !first || !second) return;
      const span = second.offsetLeft - first.offsetLeft;

      const tween = gsap.fromTo(
        track,
        { x: 0 },
        { x: -span, duration: span / speed, ease: "none", repeat: -1 },
      );

      let hovered = false;
      let onScreen = true;
      const settle = () =>
        gsap.to(tween, {
          timeScale: hovered || !onScreen ? 0 : 1,
          duration: 0.6,
        });
      const io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          if (onScreen) tween.play();
          settle();
          if (!onScreen) tween.pause();
        },
        { rootMargin: "200px 0px" },
      );
      io.observe(el);
      const slow = () => {
        hovered = true;
        settle();
      };
      const go = () => {
        hovered = false;
        settle();
      };
      el.addEventListener("pointerenter", slow);
      el.addEventListener("pointerleave", go);
      return () => {
        io.disconnect();
        el.removeEventListener("pointerenter", slow);
        el.removeEventListener("pointerleave", go);
      };
    }, el);

    return () => ctx.revert();
  }, [key, speed]);

  return (
    <div
      ref={root}
      className={`w-full overflow-hidden ${className}`}
      aria-hidden
    >
      <div data-track className="flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {words.map((word, index) => (
              <span key={`${copy}-${index}`} className="flex items-center">
                <span
                  className={`display-text wm-word whitespace-nowrap px-8 ${
                    size === "md" ? "wm-word--md" : size === "sm" ? "wm-word--sm" : ""
                  } ${tone === "ghost" ? "text-white/[0.07]" : "text-white/80"}`}
                  data-no-split=""
                >
                  {word}
                </span>
                <span
                  className={`block shrink-0 bg-brand ${
                    size === "xl" ? "size-4" : size === "md" ? "size-2.5" : "size-2"
                  } ${tone === "ghost" ? "opacity-20" : ""}`}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
