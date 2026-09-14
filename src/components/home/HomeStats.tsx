"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { homeStats } from "@/data/home";

gsap.registerPlugin(ScrollTrigger);

/**
 * The band under the hero, from Figma 2227:5202: four figures across the 1272
 * column, each 282 wide — the number in Daltown over a one-line label.
 *
 * The figures roll up the first time they come into view. A static row of
 * numbers reads as a footnote; counting makes the same four facts land.
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
    <section aria-label="SEVENPM in numbers" className="py-16 xl:py-24">
      <div
        ref={root}
        className="shell grid grid-cols-2 gap-x-12 gap-y-10 lg:grid-cols-4"
      >
        {homeStats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-4"
            data-reveal="up"
            data-reveal-stagger
          >
            <p className="m-0 flex items-baseline font-daltown text-[56px] leading-[0.8] text-white xl:text-[72px]">
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
            <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[29px] tracking-[0.15px] text-content-secondary xl:text-[17px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
