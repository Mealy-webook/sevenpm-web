import { homePillars } from "@/data/home";

/**
 * Mission, vision and values — Figma 2467:24548.
 *
 * Three equal columns, hairline-divided, each with its title at Daltown 80
 * on a 60 line box and the body at 18/24 bold uppercase. No headline over
 * the row: the three words are the headline.
 *
 * The dividers are borders on the columns rather than elements between them,
 * so the row reflows to one column on a phone with the rule turning
 * horizontal instead of disappearing.
 */
export function HomePillars() {
  return (
    <section
      aria-label="Mission, vision and values"
      className="relative py-16 xl:py-20"
    >
      <div className="shell grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
        {homePillars.map((pillar, index) => (
          <div
            key={pillar.title}
            className={`flex flex-col gap-4 ${
              index === 0
                ? ""
                : "border-t border-white/10 pt-8 md:border-l md:border-t-0 md:pl-8 md:pt-0"
            }`}
            data-reveal="up"
          >
            <h2 className="m-0 font-daltown text-[clamp(48px,6vw,80px)] uppercase leading-[0.75] tracking-[0.03em] text-white">
              {pillar.title}
            </h2>
            <p className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-secondary">
              {pillar.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
