import { homeStoryFounded, homeStoryLines } from "@/data/home";

import styles from "./story.module.css";

/**
 * D · Stub.
 *
 * The statement printed on a torn-off ticket: brand stock, a perforated
 * left edge, the founding year in the counterfoil and a barcode along the
 * bottom. The tear and the barcode are drawn in CSS — a mask of notches and
 * a repeating gradient — so there is nothing to load and nothing to go soft
 * on a retina screen.
 *
 * It carries the artefact language the ticketing pages already use, which is
 * the one thing on this site a photograph of a crowd cannot do.
 */
export function StoryStub() {
  return (
    <section aria-label="About SEVENPM" className="relative py-16 xl:py-24">
      <div className="shell flex justify-center">
        <div
          className={`${styles.stub} flex w-full max-w-[1000px] rotate-[-1deg] flex-col bg-brand text-[#18181b] sm:flex-row`}
          data-reveal="up"
        >
          {/* Counterfoil */}
          <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-b border-dashed border-[#18181b]/35 px-8 py-6 sm:w-[220px] sm:flex-col sm:items-start sm:justify-between sm:border-b-0 sm:border-r sm:py-10">
            <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2px] text-[#18181b]/65">
              Established
            </span>
            <span className="font-daltown text-[clamp(56px,7vw,96px)] uppercase leading-[0.78]">
              {homeStoryFounded}
            </span>
            <span className="hidden font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2px] text-[#18181b]/65 sm:block">
              Casablanca
            </span>
          </div>

          {/* Face */}
          <div className="flex min-w-0 flex-1 flex-col gap-6 px-8 py-8 sm:py-10">
            <span className="flex items-center gap-3 font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2px] text-[#18181b]/65">
              About SEVENPM
              <span aria-hidden className="h-px flex-1 bg-[#18181b]/25" />
              Admit all
            </span>

            <p className="m-0 font-[family-name:var(--font-display)] text-[clamp(19px,2.1vw,28px)] font-bold uppercase leading-[1.2] tracking-[-0.01em]">
              {homeStoryLines[0]}
            </p>
            <p className="m-0 max-w-[620px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-[#18181b]/75">
              {homeStoryLines[1]}
            </p>

            <span
              aria-hidden
              className={`${styles.barcode} mt-auto shrink-0`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
