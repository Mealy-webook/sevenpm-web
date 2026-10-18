"use client";

import Image from "next/image";
import { useState } from "react";

import { Cta, SectionHead, bill } from "./shared";

/**
 * H · Deck — put a festival on.
 *
 * One record turning on a platter, wearing the poster as its label, and
 * the two festivals as sleeves beside it. Pick a sleeve and its record
 * drops onto the deck and its details take over the panel. The event page
 * opens on a deck; this is the homepage handing you the same object.
 */
export function UpcomingDeck() {
  const [current, setCurrent] = useState(0);
  const f = bill[current];
  if (!f) return null;

  return (
    <section aria-labelledby="up-deck" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <SectionHead id="up-deck" />

        <div className="grid grid-cols-1 items-center gap-10 bg-bg-secondary p-6 lg:grid-cols-[1.1fr_1fr] xl:p-12">
          {/* The platter */}
          <div className="relative mx-auto aspect-square w-full max-w-[480px]">
            <span aria-hidden className="absolute inset-0 rounded-full bg-black/60 shadow-[inset_0_0_0_10px_rgba(255,255,255,0.03)]" />
            <span
              key={f.id}
              aria-hidden
              className="deck-drop absolute inset-[4%] rounded-full"
            >
              <span className="bill-record-disc deck-spin absolute inset-0 rounded-full">
                <span className="absolute inset-[30%] overflow-hidden rounded-full">
                  <Image src={f.card as string} alt="" fill sizes="200px" className="object-cover" />
                </span>
                <span className="absolute inset-[48.6%] rounded-full bg-[#0b0b0e]" />
              </span>
            </span>
            {/* the arm, resting on the record */}
            <span aria-hidden className="absolute -right-2 top-[6%] h-[58%] w-[6px] origin-top rotate-[22deg] bg-gradient-to-b from-[#d4d4d8] to-[#71717a]" />
            <span aria-hidden className="absolute -right-5 top-[2%] size-10 rounded-full bg-[#3f3f46] shadow-[inset_0_0_0_6px_#27272a]" />
          </div>

          {/* What is on, and what else */}
          <div className="flex flex-col gap-8">
            <div key={f.id} className="deck-fade flex flex-col gap-4">
              <span className="w-fit bg-brand px-3 py-1.5 font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.1em] text-[#0b0b0e]">
                Now on the deck · {f.edition}
              </span>
              <h3 className="card-title text-white">{f.name}</h3>
              <p className="m-0 font-[family-name:var(--font-display)] text-body text-text-secondary">
                {[f.when, f.city].filter(Boolean).join(" · ")}
              </p>
              <Cta festival={f} className="w-fit" />
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-[family-name:var(--font-display)] text-caption uppercase tracking-[0.12em] text-text-secondary">
                Choose a record
              </span>
              <div className="flex gap-4">
                {bill.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-pressed={i === current}
                    aria-label={`Put ${s.name} on the deck`}
                    className={`relative size-28 overflow-hidden outline-offset-4 transition-[opacity,translate] duration-300 xl:size-32 ${i === current ? "opacity-100 outline outline-2 outline-brand" : "opacity-50 hover:-translate-y-1 hover:opacity-100"}`}
                  >
                    <Image src={s.card as string} alt="" fill sizes="128px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
