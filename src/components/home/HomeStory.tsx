import {
  homeStoryFounded,
  homeStoryHeading,
  homeStoryLines,
  homeStoryStatement,
} from "@/data/home";

import styles from "./HomeStory.module.css";

/**
 * The founding block — Figma 2467:24510.
 *
 * Two equal columns: the year at 370 outlined in brand on the left, and on
 * the right the name at Daltown 152/118, the statement at 30/34 and the
 * line about what followed at 17/24.
 *
 * The photographs and the peelable stickers this section used to carry are
 * gone; the comp draws the block in type alone, and the year does the work
 * the pictures were doing.
 *
 * The figure is `aria-hidden` — the statement beside it already says 2018,
 * and a screen reader should not hear the year twice.
 */
export function HomeStory() {
  return (
    <section
      aria-label="About SEVENPM"
      className="relative py-16 [overflow-x:clip] xl:py-20"
    >
      <div className="shell grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <span aria-hidden className={`${styles.year} block`}>
          {homeStoryFounded}
        </span>

        <div className="flex flex-col gap-4">
          <h2
            className="m-0 font-daltown text-[clamp(64px,10vw,152px)] uppercase leading-[0.78] tracking-[0.03em] text-white"
            data-reveal="clip"
          >
            {homeStoryHeading}
          </h2>
          <p
            className="m-0 font-[family-name:var(--font-display)] text-[clamp(21px,2.2vw,30px)] font-bold uppercase leading-[1.14] tracking-[-0.15px] text-white"
            data-split="lines"
          >
            {homeStoryStatement}
          </p>
          <p
            className="m-0 font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary"
            data-reveal="up"
          >
            {homeStoryLines[1]}
          </p>
        </div>
      </div>
    </section>
  );
}
