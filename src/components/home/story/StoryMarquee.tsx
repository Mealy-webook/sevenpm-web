import { Emphasise } from "@/components/home/story/Emphasise";
import { homeStoryHighlights, homeStoryLines } from "@/data/home";

import styles from "./story.module.css";

/**
 * C · Marquee.
 *
 * Two bands of kinetic type — the name repeated, outlined and solid,
 * travelling in opposite directions — with the statement held between them.
 * The movement does the work the photographs used to do: it gives the block
 * a pulse without putting another crowd on the page.
 *
 * Each track is duplicated and translated by half its width, which is what
 * makes the loop seamless; the copy is hidden from the reader, who would
 * otherwise hear the name eight times.
 */
function Band({ reverse = false }: { reverse?: boolean }) {
  const words = ["SEVENPM", "MORE MUSIC", "SEVENPM", "MORE LIFE"];
  return (
    <div
      className={styles.marqueeBand}
      data-direction={reverse ? "reverse" : undefined}
      aria-hidden
    >
      <div className={styles.marqueeTrack}>
        {[0, 1].map((copy) =>
          words.map((word, index) => (
            <span
              key={`${copy}-${word}-${index}`}
              className={`${styles.marqueeWord} ${
                index % 2 ? styles.marqueeGhost : "text-white"
              }`}
            >
              {word}
            </span>
          )),
        )}
      </div>
    </div>
  );
}

export function StoryMarquee() {
  return (
    <section
      aria-label="About SEVENPM"
      className="relative flex flex-col gap-10 overflow-hidden py-16 xl:gap-14 xl:py-24"
    >
      <Band />

      <div className="shell flex flex-col items-center gap-6">
        <p
          className="m-0 max-w-[900px] text-center font-[family-name:var(--font-display)] text-[clamp(20px,2.4vw,32px)] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-white"
          data-split="lines"
        >
          <Emphasise text={homeStoryLines[0]} phrases={homeStoryHighlights} />
        </p>
        <p
          className="m-0 max-w-[720px] text-center font-[family-name:var(--font-display)] text-[17px] leading-7 tracking-[0.085px] text-content-secondary"
          data-reveal="up"
        >
          {homeStoryLines[1]}
        </p>
      </div>

      <Band reverse />
    </section>
  );
}
