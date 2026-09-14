"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling, driven from GSAP's ticker so ScrollTrigger and the
 * scroll position never disagree. Anchors (`href="#tickets"`) glide through
 * Lenis; elements marked `data-lenis-prevent` (the horizontal tile row) keep
 * native wheel behaviour.
 *
 * Anything that locks the page by setting `body { overflow: hidden }` — the
 * full-screen menu, the preloader — pauses Lenis automatically: a
 * MutationObserver watches the body's style attribute so those components
 * don't have to know Lenis exists.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch devices scroll natively; Lenis only smooths wheel input.
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      anchors: { offset: -24 },
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const sync = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });
    sync();

    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
