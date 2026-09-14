"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Stat } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/** Four figures in Daltown that count up the first time they scroll into view. */
export function AboutStats({ stats }: { stats: Stat[] }) {
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
        const format = (n: number) =>
          target >= 1000 && target < 2100 && node.dataset.year === "true"
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
    <div
      ref={root}
      className="grid w-full grid-cols-2 border-t border-border-tertiary lg:grid-cols-4"
      data-reveal="up"
      data-reveal-stagger
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-3 border-b border-border-tertiary px-2 py-8 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:px-6 lg:py-12"
        >
          <p className="m-0 flex items-baseline gap-1 font-daltown text-[56px] leading-[0.9] text-white sm:text-[72px] xl:text-[96px]">
            {stat.prefix}
            <span
              data-count={stat.value}
              data-year={stat.value === 2018 ? "true" : undefined}
            >
              {stat.value.toLocaleString("en-US")}
            </span>
            {stat.suffix && <span className="text-brand">{stat.suffix}</span>}
          </p>
          <p className="m-0 max-w-[220px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
