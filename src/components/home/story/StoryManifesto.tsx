import { Emphasise } from "@/components/home/story/Emphasise";
import { homeStoryHighlights, homeStoryLines } from "@/data/home";

/**
 * A · Manifesto.
 *
 * The statement is the artwork. Set at display scale over a short measure
 * and ranged left, with the four phrases that carry the claim — the year,
 * the country, what the company became and what it makes — flooded brand.
 *
 * Nothing else is on the screen, which is the point: a photograph of a crowd
 * says the same thing as every other festival's photograph of a crowd.
 */
export function StoryManifesto() {
  return (
    <section aria-label="About SEVENPM" className="relative py-16 xl:py-24">
      <div className="shell flex flex-col gap-10">
        <span className="flex items-center gap-4 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-content-secondary">
          About
          <span aria-hidden className="h-px w-16 bg-white/20" />
        </span>

        <p
          className="m-0 max-w-[1180px] font-[family-name:var(--font-display)] text-[clamp(26px,3.6vw,52px)] font-bold uppercase leading-[1.08] tracking-[-0.01em] text-white"
          data-split="lines"
        >
          <Emphasise text={homeStoryLines[0]} phrases={homeStoryHighlights} />
        </p>

        <p
          className="m-0 max-w-[720px] font-[family-name:var(--font-display)] text-[17px] leading-7 tracking-[0.085px] text-content-secondary"
          data-reveal="up"
        >
          <Emphasise
            text={homeStoryLines[1]}
            phrases={homeStoryHighlights}
            className="font-semibold text-white"
          />
        </p>
      </div>
    </section>
  );
}
