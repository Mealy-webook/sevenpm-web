import styles from "./HomeMarquee.module.css";

/**
 * The kinetic band between the festivals and the founding block — Figma
 * 2465:6936.
 *
 * Daltown at 120 on a 90 line box, the line alternating between an outlined
 * "MORE MUSIC" and a solid "MORE LIFE", 32 apart. The comp draws it as a
 * static overflowing row; here it travels, which is the only thing a band of
 * eight repeated words can usefully do.
 *
 * The track holds its words twice and animates to −50%, so the loop closes
 * on itself with no measuring. Hidden from assistive tech — it is the line
 * the hero already says.
 */
export function HomeMarquee({ reverse = false }: { reverse?: boolean }) {
  const words = ["More music", "More life"];
  return (
    <section
      aria-hidden
      className="relative flex overflow-hidden py-14 xl:py-20"
    >
      <div
        className={styles.band}
        data-direction={reverse ? "reverse" : undefined}
      >
        <div className={styles.track}>
          {[0, 1, 2, 3].map((copy) =>
            words.map((word, index) => (
              <span
                key={`${copy}-${word}`}
                className={`${styles.word} ${
                  index % 2 ? "text-white" : styles.ghost
                }`}
              >
                {word}
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
