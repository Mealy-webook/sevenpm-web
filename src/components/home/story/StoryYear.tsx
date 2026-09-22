import { Emphasise } from "@/components/home/story/Emphasise";
import {
  homeStoryFounded,
  homeStoryHighlights,
  homeStoryLines,
} from "@/data/home";

import styles from "./story.module.css";

/**
 * E · Year.
 *
 * One number at poster size, outlined in brand so it reads as a mark rather
 * than as a headline, with the statement set against it. The year is the
 * only fact in the sentence a reader will remember, so it is the only thing
 * drawn large.
 *
 * The figure is `aria-hidden`: the sentence beside it already says 2018, and
 * a screen reader should not hear the year twice.
 */
export function StoryYear() {
  return (
    <section
      aria-label="About SEVENPM"
      className="relative py-16 [overflow-x:clip] xl:py-24"
    >
      <div className="shell grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16">
        <span aria-hidden className={`${styles.yearFigure} block`}>
          {homeStoryFounded}
        </span>

        <div className="flex flex-col gap-6">
          <span className="flex items-center gap-4 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-content-secondary">
            <span aria-hidden className="h-px w-10 bg-brand" />
            About SEVENPM
          </span>
          <p
            className="m-0 font-[family-name:var(--font-display)] text-[clamp(20px,2.2vw,30px)] font-bold uppercase leading-[1.22] tracking-[-0.01em] text-white"
            data-split="lines"
          >
            <Emphasise text={homeStoryLines[0]} phrases={homeStoryHighlights} />
          </p>
          <p
            className="m-0 font-[family-name:var(--font-display)] text-[17px] leading-7 tracking-[0.085px] text-content-secondary"
            data-reveal="up"
          >
            {homeStoryLines[1]}
          </p>
        </div>
      </div>
    </section>
  );
}
