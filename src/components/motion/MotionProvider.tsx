"use client";

import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { READY_EVENT, SEEN_KEY } from "./Preloader";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Page-wide motion, driven by data attributes so the section components stay
 * declarative:
 *
 *   data-reveal="up"            fade + rise as it scrolls in
 *   data-reveal="clip"          wipe up from a clipped mask (display headings)
 *   data-reveal="scale"         settle in from slightly small
 *   data-reveal-stagger         stagger this element's children instead
 *   data-reveal-delay="0.15"    extra delay, seconds
 *   data-parallax="-0.12"       drift on scroll; negative moves against it
 *   data-magnetic               nudge toward the cursor on hover
 *   data-split="lines"          paragraph rises line by line through a mask
 *   .display-text               headings reveal character by character
 *
 * Two rules keep this from ever stranding content:
 *   1. nothing is hidden in CSS — the "from" state is set here, before paint,
 *      so a JS failure or reduced-motion just leaves the page visible;
 *   2. a rescue pass re-shows anything still hidden but on screen.
 */

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const REVEAL_SELECTOR = "[data-reveal]";

export function MotionProvider() {
  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* On a first visit the preloader covers the page for ~2.5s; the hero's
     * reveals wait for its `sevenpm:ready` so they play once it lifts. The
     * from-states are still applied immediately (inside the context below),
     * so nothing flashes. */
    let seen = true;
    try {
      seen = Boolean(sessionStorage.getItem(SEEN_KEY));
    } catch {
      seen = true;
    }
    if (!seen) {
      ScrollTrigger.getAll().forEach((t) => t.disable(false));
    }

    const ctx = gsap.context(() => {
      /* ---------------------------------------------------------------- */
      /* Display headings: characters rise in one after another            */
      /* ---------------------------------------------------------------- */
      gsap.utils.toArray<HTMLElement>(".display-text").forEach((el) => {
        const split = SplitText.create(el, {
          type: "chars,words",
          charsClass: "split-char",
          wordsClass: "split-word",
        });
        gsap.set(split.chars, { yPercent: 60, opacity: 0, rotate: 4 });
        gsap.to(split.chars, {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: { each: 0.022, from: "start" },
          delay: Number(el.dataset.revealDelay ?? 0),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      /* ---------------------------------------------------------------- */
      /* Paragraphs: line by line through a mask                           */
      /* ---------------------------------------------------------------- */
      gsap.utils.toArray<HTMLElement>('[data-split="lines"]').forEach((el) => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
        });
        gsap.set(split.lines, { yPercent: 110 });
        gsap.to(split.lines, {
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          delay: Number(el.dataset.revealDelay ?? 0),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      /* ---------------------------------------------------------------- */
      /* Scroll reveals                                                     */
      /* ---------------------------------------------------------------- */
      gsap.utils.toArray<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        // Headings and split paragraphs animate above; skip them here.
        if (el.matches('.display-text, [data-split="lines"]')) return;
        const kind = el.dataset.reveal || "up";
        const delay = Number(el.dataset.revealDelay ?? 0);
        const isStagger = el.hasAttribute("data-reveal-stagger");
        const targets = isStagger
          ? (Array.from(el.children) as HTMLElement[])
          : [el];
        if (!targets.length) return;

        const from: gsap.TweenVars = { autoAlpha: 0 };
        const to: gsap.TweenVars = { autoAlpha: 1 };

        if (kind === "clip") {
          from.clipPath = "inset(0% 0% 100% 0%)";
          from.y = 24;
          to.clipPath = "inset(0% 0% 0% 0%)";
          to.y = 0;
        } else if (kind === "scale") {
          from.scale = 0.88;
          to.scale = 1;
        } else {
          from.y = 44;
          to.y = 0;
        }

        gsap.set(targets, from);
        gsap.to(targets, {
          ...to,
          duration: kind === "clip" ? 1.1 : 0.85,
          ease: kind === "clip" ? "expo.out" : "power3.out",
          delay,
          stagger: isStagger ? 0.075 : 0,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* ---------------------------------------------------------------- */
      /* Parallax                                                           */
      /* ---------------------------------------------------------------- */
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax || 0.15);
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      /* ---------------------------------------------------------------- */
      /* Magnetic buttons                                                   */
      /* ---------------------------------------------------------------- */
      if (window.matchMedia("(hover: hover)").matches) {
        gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
          const strength = Number(el.dataset.magnetic || 0.25);
          const quickX = gsap.quickTo(el, "x", {
            duration: 0.5,
            ease: "power3.out",
          });
          const quickY = gsap.quickTo(el, "y", {
            duration: 0.5,
            ease: "power3.out",
          });

          const move = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            quickX((e.clientX - (rect.left + rect.width / 2)) * strength);
            quickY((e.clientY - (rect.top + rect.height / 2)) * strength);
          };
          const reset = () => {
            quickX(0);
            quickY(0);
          };

          el.addEventListener("mousemove", move);
          el.addEventListener("mouseleave", reset);
        });
      }
    });

    let onReady: (() => void) | null = null;
    if (!seen) {
      const triggers = ScrollTrigger.getAll();
      triggers.forEach((t) => t.disable(false));
      onReady = () => {
        triggers.forEach((t) => t.enable(false));
        ScrollTrigger.refresh();
      };
      document.addEventListener(READY_EVENT, onReady, { once: true });
    }

    /* Safety net: anything still hidden but on screen after the page has
     * settled gets shown. Guards against a trigger that never fires because
     * of a late layout shift. */
    const rescue = () => {
      ScrollTrigger.refresh();
      document
        .querySelectorAll<HTMLElement>(".split-char, .split-line")
        .forEach((node) => {
          const rect = node.getBoundingClientRect();
          if (
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            Number(getComputedStyle(node).opacity) < 1
          ) {
            gsap.to(node, {
              yPercent: 0,
              opacity: 1,
              rotate: 0,
              duration: 0.4,
            });
          }
        });
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        const nodes = el.hasAttribute("data-reveal-stagger")
          ? (Array.from(el.children) as HTMLElement[])
          : [el];
        nodes.forEach((node) => {
          const rect = node.getBoundingClientRect();
          const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
          if (onScreen && getComputedStyle(node).visibility === "hidden") {
            gsap.to(node, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.4,
            });
          }
        });
      });
    };

    const rescueTimer = window.setTimeout(rescue, seen ? 2500 : 6000);
    window.addEventListener("load", rescue);

    return () => {
      window.clearTimeout(rescueTimer);
      window.removeEventListener("load", rescue);
      if (onReady) document.removeEventListener(READY_EVENT, onReady);
      ctx.revert();
    };
  }, []);

  return null;
}
