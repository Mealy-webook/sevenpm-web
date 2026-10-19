import Image from "next/image";

import { homePillars } from "@/data/home";

/**
 * Mission, vision and values — Figma 2467:24548.
 *
 * Three equal cards on the secondary ground, 32 apart, each with 32 of
 * padding: the comp's yellow icon at 64, then the word at the card-title
 * step (Daltown 72/60) and the line in Body-Default, 16 between each. No
 * headline over the row: the three words are the headline. The cards stack
 * on a phone.
 *
 * The comp still repeats Vision's text under Values; Values carries the
 * line Ahmed supplied instead.
 */
export function HomePillars() {
  return (
    <section
      aria-label="Mission, vision and values"
      className="relative py-16 xl:py-20"
    >
      <div className="shell grid grid-cols-1 gap-8 md:grid-cols-3">
        {homePillars.map((pillar) => (
          <article
            key={pillar.title}
            className="flex flex-col gap-4 bg-bg-secondary p-8"
            data-reveal="up"
          >
            <Image
              src={pillar.icon}
              alt=""
              width={64}
              height={64}
              className="size-16"
            />
            <h2 className="card-title text-white">{pillar.title}</h2>
            <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
              {pillar.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
