"use client";

import { useId, useState } from "react";

import { homeCopy } from "@/data/home";

/**
 * "Be the first to know", from Figma 2466:7088 as redrawn in the homepage.
 *
 * It is a yellow bill taped to the page: the sheet sits a degree off square
 * with a strip of tape over each opposite corner, the headline in Daltown at
 * 120 over a hairline rule, the body underneath, then the field and a dark
 * Subscribe button side by side.
 *
 * The tape is two grey strips at −33.63°, which is what the comp draws. Both
 * the tilt and the strips live on the sheet, so the tape is stuck to it
 * rather than parked near it.
 *
 * Nothing is sent. There is no list behind this build, so the button
 * acknowledges in place rather than pretending to subscribe anyone.
 */
export function NewsletterSection() {
  const { title, body, cta } = homeCopy.newsletter;
  const fieldId = useId();
  const [sent, setSent] = useState(false);

  return (
    <section id="newsletter" className="relative py-16 xl:py-20">
      <div className="shell relative flex flex-col items-center">
        <div
          data-reveal="up"
          className="relative w-full max-w-[1054px] rotate-1 bg-brand px-6 py-10 text-[#18181b] sm:px-10 sm:py-12"
        >
          {/* Tape. Inside the sheet rather than beside it, so it tilts with
              the sheet and stays stuck to it at any width — it used to be
              positioned against the shell, which is wider than the sheet and
              is not rotated, so the strips drifted off the corners.

              The comp's strips are 118 × 25 at −33.63° (a 112 × 86 bounding
              box, which is what 2466:7869 and :7870 measure). Their centres
              land at 1.86% / 21.96% and 96.99% / 102.6% of the sheet: one
              straddling the left edge near the top, one over the
              bottom-right corner. */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[1.86%] top-[21.96%] z-[2] block h-[25px] w-[118px] -translate-x-1/2 -translate-y-1/2 -rotate-[33.63deg] bg-[rgba(217,217,217,0.3)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-[96.99%] top-[102.6%] z-[2] block h-[25px] w-[118px] -translate-x-1/2 -translate-y-1/2 -rotate-[33.63deg] bg-[rgba(217,217,217,0.3)]"
          />

          <div className="flex flex-col items-center gap-4">
            <h2 className="m-0 text-center font-daltown text-[clamp(38px,8vw,120px)] uppercase leading-[0.98]">
              {title}
            </h2>
            <span
              aria-hidden
              className="block h-px w-full max-w-[609px] bg-[#18181b]/35"
            />
            <p className="m-0 max-w-[636px] text-center font-[family-name:var(--font-ui)] text-[16px] leading-[1.6] text-[#56565d]">
              {body}
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-stretch">
            <label className="sr-only" htmlFor={fieldId}>
              Email address
            </label>
            <input
              id={fieldId}
              type="email"
              placeholder="you@example.com"
              onChange={() => setSent(false)}
              className="w-full max-w-[350px] border-[0.5px] border-[#18181b] bg-transparent px-4 py-3 font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-[#18181b] placeholder:text-[#18181b]/55 focus:outline-none focus:ring-2 focus:ring-[#18181b]"
            />
            <button
              type="button"
              onClick={() => setSent(true)}
              className="flex shrink-0 items-center justify-center bg-[#0b0b0e] px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-white transition-colors hover:bg-[#0b0b0e]/85"
            >
              {sent ? "Noted" : cta}
            </button>
          </div>

          {/* Said in place, so the button's press has an answer. */}
          <p
            role="status"
            className="m-0 mt-3 text-center font-[family-name:var(--font-display)] text-[13px] leading-5 text-[#18181b]/70"
          >
            {sent ? "Thanks — nothing is sent from this prototype." : " "}
          </p>
        </div>
      </div>
    </section>
  );
}
