"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { homeStats } from "@/data/home";

gsap.registerPlugin(ScrollTrigger);

/**
 * The four figures as one hairline-divided strip, for sitting at the foot of
 * a screen rather than taking a band of the page to themselves. The numbers
 * roll up the first time they are seen, as in `HomeStats`.
 */
export function StatsStrip({ className = "" }: { className?: string }) {
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
          scrollTrigger: { trigger: node, start: "top 90%", once: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-label="SEVENPM in numbers"
      className={`grid grid-cols-2 border-t border-white/10 lg:grid-cols-4 ${className}`}
      data-reveal="up"
    >
      {homeStats.map((stat, index) => (
        <div
          key={stat.label}
          className={`flex flex-col gap-2 py-6 ${
            index > 0 ? "lg:border-l lg:border-white/10 lg:pl-8" : ""
          } ${index % 2 === 1 ? "border-l border-white/10 pl-6 lg:pl-8" : ""}`}
        >
          <p className="m-0 flex items-baseline font-daltown text-[48px] leading-[0.8] text-white xl:text-[64px]">
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
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.3px] text-content-secondary">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
