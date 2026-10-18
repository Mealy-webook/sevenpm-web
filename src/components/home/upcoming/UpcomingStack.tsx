"use client";

import Image from "next/image";
import { useState } from "react";

import { Cta, SectionHead, bill } from "./shared";

/**
 * I · Stack — one on top of the other.
 *
 * The two posters as a pile, the one on top fanned a little so the other
 * shows behind it — the app's Discover deck, on the website. Tap the one
 * underneath (or the arrow) and it comes to the top; the details beside
 * the pile follow whichever is showing.
 */
export function UpcomingStack() {
  const [top, setTop] = useState(0);
  const f = bill[top];
  if (!f) return null;
  const next = () => setTop((t) => (t + 1) % bill.length);

  return (
    <section aria-labelledby="up-stack" className="relative overflow-hidden py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <SectionHead id="up-stack" />

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto aspect-square w-[min(460px,78vw)]">
            {bill.map((s, i) => {
              const depth = (i - top + bill.length) % bill.length;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={depth === 0 ? undefined : next}
                  tabIndex={depth === 0 ? -1 : 0}
                  aria-label={depth === 0 ? undefined : `Show ${s.name}`}
                  aria-hidden={depth === 0}
                  className="absolute inset-0 shadow-[0_30px_70px_rgba(0,0,0,0.6)] transition-[translate,rotate,scale,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    zIndex: 10 - depth,
                    translate: depth === 0 ? "0 0" : "14% -6%",
                    rotate: depth === 0 ? "-3deg" : "6deg",
                    scale: depth === 0 ? "1" : "0.92",
                    filter: depth === 0 ? "none" : "grayscale(1) brightness(0.7)",
                    cursor: depth === 0 ? "default" : "pointer",
                  }}
                >
                  <Image src={s.card as string} alt={depth === 0 ? `${s.name} poster` : ""} fill sizes="460px" className="object-cover" />
                </button>
              );
            })}
          </div>

          <div key={f.id} className="deck-fade flex flex-col gap-5">
            <span className="font-[family-name:var(--font-display)] text-body-s uppercase tracking-[0.12em] text-text-secondary">
              {String(top + 1).padStart(2, "0")} / {String(bill.length).padStart(2, "0")} · {f.edition}
            </span>
            <h3 className="section-title m-0 font-daltown uppercase text-white">
              {f.name}
            </h3>
            <p className="m-0 font-[family-name:var(--font-display)] text-body-l text-text-primary">
              {[f.when, f.city].filter(Boolean).join(" · ")}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Cta festival={f} />
              <button
                type="button"
                onClick={next}
                className="btn-secondary px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-text-primary"
              >
                Next festival →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
