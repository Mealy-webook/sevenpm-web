"use client";

import Image from "next/image";
import { useId, useState } from "react";

import type { EventDetails } from "@/data/events";
import { DISPLAY_ART, DisplayHeading } from "@/components/ui/DisplayHeading";

export function FaqSection({ event }: { event: EventDetails }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" className="relative bg-ink-900 py-16 xl:py-24">
      <div className="shell flex flex-col items-start gap-12 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <DisplayHeading art={DISPLAY_ART.faq} align="left" reveal="clip">
            Frequently asked questions
          </DisplayHeading>
        </div>

        <div
          className="flex min-w-0 flex-1 flex-col items-start"
          data-reveal="up"
          data-reveal-stagger
        >
          {event.faq.map((item, index) => {
            const open = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <div
                key={index}
                className="group w-full border-b border-border-tertiary transition-colors duration-300 hover:border-white/25"
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-start gap-8 p-6 text-left"
                >
                  <span
                    className={`flex shrink-0 items-center border border-border-secondary p-4 transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-white/60 group-hover:bg-white/5 ${
                      open ? "rotate-180" : ""
                    }`}
                  >
                    <Image
                      src={open ? "/assets/ic-minus.svg" : "/assets/ic-plus.svg"}
                      alt=""
                      width={24}
                      height={24}
                      className="size-6"
                    />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col justify-center">
                    <span className="font-[family-name:var(--font-display)] text-[22px] font-bold leading-7 tracking-[-0.11px] text-white transition-colors duration-300 group-hover:text-brand">
                      {item.question}
                    </span>
                    {item.answer && (
                      // 0fr → 1fr animates the answer open without measuring it.
                      <span
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          gridTemplateRows: open ? "1fr" : "0fr",
                          opacity: open ? 1 : 0,
                        }}
                      >
                        <span className="overflow-hidden">
                          <span className="block pt-2 font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
                            {item.answer}
                          </span>
                        </span>
                      </span>
                    )}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
