import { Emphasise } from "@/components/home/Emphasise";
import { homeStoryHighlights, homeStoryLines } from "@/data/home";

import styles from "./HomeStory.module.css";

/**
 * The story block.
 *
 * It used to be two photographs pinned at opposing angles with peelable
 * stickers over them (Figma 2227:5229). A photograph of a crowd says the
 * same thing as every other festival's photograph of a crowd, so the images
 * are gone and the movement does their work instead: two bands of kinetic
 * type running opposite ways, with the founding statement held between them.
 *
 * The phrases that carry the claim — the year, the country, what the company
 * became and what it makes — are flooded brand. The bands are `aria-hidden`;
 * a reader should not hear the name eight times.
 */
function Band({ reverse = false }: { reverse?: boolean }) {
  const words = ["SEVENPM", "MORE MUSIC", "SEVENPM", "MORE LIFE"];
  return (
    <div
      className={styles.band}
      data-direction={reverse ? "reverse" : undefined}
      aria-hidden
    >
      <div className={styles.track}>
        {[0, 1].map((copy) =>
          words.map((word, index) => (
            <span
              key={`${copy}-${word}-${index}`}
              className={`${styles.word} ${
                index % 2 ? styles.ghost : "text-white"
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

export function HomeStory() {
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
