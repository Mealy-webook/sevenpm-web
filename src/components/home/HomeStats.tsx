"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { homeStats } from "@/data/home";

gsap.registerPlugin(ScrollTrigger);

/**
 * The figures, from Figma 2227:5202 — three across the 1272 column since the
 * founding year came out.
 *
 * Drawn as a press sheet rather than a loose row: a slug line over the top,
 * hairline rules between the cells, and each figure over a short brand mark
 * and its label. Three numbers floating in space read as a footnote; ruled
 * cells read as a statement, and the section finally says what it is.
 *
 * The figures roll up the first time they come into view, and the cell they
 * sit in answers the cursor, because a fact worth this much room should look
 * like something you can point at.
 */
export function HomeStats() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((node) => {
        const target = Number(node.dataset.count);
        // Years are not thousands: 2018, never 2,018.
        const format = (n: number) =>
          node.dataset.year === "true"
            ? String(Math.round(n))
            : Math.round(n).toLocaleString("en-US");

        if (reduce) {
          node.textContent = format(target);
          return;
        }
        const state = { n: 0 };
        node.textContent = format(0);
        gsap.to(state, {
          n: target,
          duration: 1.6,
          ease: "power3.out",
          onUpdate: () => {
            node.textContent = format(state.n);
          },
          scrollTrigger: { trigger: node, start: "top 85%", once: true },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section aria-labelledby="numbers-title" className="py-16 xl:py-24">
      <div className="shell flex flex-col gap-8">
        <p
          id="numbers-title"
          className="m-0 flex items-center gap-4 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-content-secondary"
        >
          <span className="text-brand">SEVENPM</span>
          in numbers
          <span aria-hidden className="h-px flex-1 bg-white/15" />
        </p>

        {/* gap-px over a light ground is how the rules between cells are
            drawn: no borders to double up at the joins. */}
        <div
          ref={root}
          className="grid grid-cols-1 gap-px border-y border-white/10 bg-white/10 sm:grid-cols-3"
        >
          {homeStats.map((stat) => (
            <div
              key={stat.label}
              className="group flex flex-col gap-4 bg-bg-primary px-6 py-10 transition-colors hover:bg-white/[0.03] xl:px-8 xl:py-12"
              data-reveal="up"
              data-reveal-stagger
            >
              <p className="m-0 flex items-baseline font-daltown text-[clamp(56px,7vw,96px)] leading-[0.8] text-white transition-colors group-hover:text-brand">
                {stat.prefix && <span>{stat.prefix}</span>}
                <span
                  data-count={stat.value}
                  data-year={stat.year ? "true" : undefined}
                  className="tabular-nums"
                >
                  {stat.value}
                </span>
                {stat.suffix && <span>{stat.suffix}</span>}
              </p>

              <span
                aria-hidden
                className="block h-[3px] w-10 bg-brand transition-[width] duration-500 group-hover:w-16"
              />

              <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary xl:text-[17px] xl:leading-[26px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
