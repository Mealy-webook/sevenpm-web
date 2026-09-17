"use client";

import Image from "next/image";
import { useId, useState } from "react";

import type { EventDetails } from "@/data/events";
import { FaqAnswer } from "./FaqAnswer";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

/**
 * FAQ accordion. One item open at a time, the first by default. The answer
 * panel is a sibling of the question button (not inside it), so the button
 * stays a plain toggle and the panel is its own landmark for assistive tech.
 *
 * The panel opens on a 0fr → 1fr grid; `FaqAnswer` walks the text up into it a
 * line at a time as it goes.
 */
export function FaqSection({ event }: { event: EventDetails }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" className="section-screen relative bg-ink-900 py-16 xl:py-24">
      <div className="shell flex flex-col items-start gap-12 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <DisplayHeading size="faq" align="left" reveal="clip">
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
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full cursor-pointer items-start gap-8 p-6 text-left"
                  >
                    <span
                      className={`flex shrink-0 items-center border border-border-secondary p-4 transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-white/60 group-hover:bg-white/5 ${
                        open ? "rotate-180" : ""
                      }`}
                    >
                      <Image
                        src={
                          open ? "/assets/ic-minus.svg" : "/assets/ic-plus.svg"
                        }
                        alt=""
                        width={24}
                        height={24}
                        className="size-6"
                      />
                    </span>
                    <span className="flex min-h-14 min-w-0 flex-1 items-center">
                      <span className="font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white transition-colors duration-300 group-hover:text-brand">
                        {item.question}
                      </span>
                    </span>
                  </button>
                </h3>

                {/* 0fr → 1fr animates the answer open without measuring it. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!open}
                  className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    gridTemplateRows: open ? "1fr" : "0fr",
                    opacity: open ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <FaqAnswer
                      open={open}
                      className="m-0 px-6 pb-6 pl-[calc(1.5rem+56px+2rem)] font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary"
                    >
                      {item.answer ?? "Details coming soon."}
                    </FaqAnswer>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
