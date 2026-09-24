"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { festivals, festivalsRowOrder, homeCopy } from "@/data/home";

/**
 * D · Departure board.
 *
 * The hero as a schedule: festival, city, dates, status, ruled and set at
 * display scale. On load each cell flicks over the way a split-flap board
 * does — the characters cycle briefly and settle, column by column.
 *
 * It is the only option that treats the hero as information rather than as
 * an image, and the only one that says on the first screen what is actually
 * on sale.
 *
 * The flap cycles letters from a fixed alphabet rather than random ones so
 * two loads look the same, and it writes textContent directly rather than
 * through state — one setState per character per frame would be thousands
 * of renders a second.
 */
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ·—";

export function HeroBoard() {
  const root = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>("[data-flap]");
      cells.forEach((cell, index) => {
        const target = cell.dataset.flap ?? "";
        const state = { t: 0 };
        gsap.to(state, {
          t: 1,
          duration: 0.5 + (index % 5) * 0.12,
          ease: "power2.out",
          delay: 0.1 + index * 0.05,
          onUpdate: () => {
            const settled = Math.floor(state.t * target.length);
            const scramble = target
              .slice(settled)
              .split("")
              .map((char) =>
                char === " "
                  ? " "
                  : ALPHABET[
                      (settled * 7 + char.charCodeAt(0)) % ALPHABET.length
                    ],
              )
              .join("");
            cell.textContent = target.slice(0, settled) + scramble;
          },
          onComplete: () => {
            cell.textContent = target;
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const rows = festivalsRowOrder
    .map((id) => festivals.find((f) => f.id === id))
    .filter((f): f is (typeof festivals)[number] => Boolean(f));

  return (
    <section className="relative flex h-svh w-full flex-col justify-center overflow-hidden bg-bg-primary px-[var(--shell-gutter)]">
      <h1
        className="m-0 font-daltown text-[clamp(38px,6vw,96px)] uppercase leading-[0.82] tracking-[0.02em] text-white"
        data-no-split
      >
        {homeCopy.heroTitle}
      </h1>

      <table className="mt-8 w-full border-collapse text-left">
        <thead>
          <tr className="border-y border-white/15">
            {["Festival", "City", "Dates", "Status"].map((head) => (
              <th
                key={head}
                scope="col"
                className="py-3 font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2px] text-content-secondary"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody ref={root}>
          {rows.map((festival) => {
            const cells = [
              festival.name,
              festival.city ?? "",
              festival.when ?? "To be announced",
              festival.when ? "On sale" : "Soon",
            ];
            return (
              <tr key={festival.id} className="border-b border-white/10">
                {cells.map((cell, index) => (
                  <td
                    key={index}
                    data-flap={cell.toUpperCase()}
                    className={`py-[clamp(8px,1.6vh,20px)] pr-4 font-[family-name:var(--font-display)] uppercase tabular-nums ${
                      index === 0
                        ? "text-[clamp(18px,2.6vw,38px)] font-bold leading-tight tracking-[-0.01em] text-white"
                        : "text-[clamp(11px,1.1vw,15px)] leading-5 tracking-[1.5px] text-content-secondary"
                    } ${index === 3 && festival.when ? "!text-brand" : ""}`}
                  >
                    {cell.toUpperCase()}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="m-0 mt-8 max-w-[560px] font-[family-name:var(--font-display)] text-[15px] leading-6 tracking-[0.085px] text-content-secondary">
        {homeCopy.intro}
      </p>
    </section>
  );
}
