import { Emphasise } from "@/components/home/story/Emphasise";
import {
  homeStoryFounded,
  homeStoryHighlights,
  homeStoryLines,
} from "@/data/home";

/**
 * B · Ledger.
 *
 * The press-sheet language the numbers section uses, applied to the words:
 * a hairline grid, a label column on the left and the statement in the
 * measure beside it, one sentence per ruled row.
 *
 * It is the quietest of the five and the one that scales best — a third
 * sentence is another row, not a new composition.
 */
export function StoryLedger() {
  const rows = [
    { label: "Founded", value: homeStoryFounded, body: homeStoryLines[0] },
    { label: "Since then", value: "Today", body: homeStoryLines[1] },
  ];

  return (
    <section aria-label="About SEVENPM" className="relative py-16 xl:py-24">
      <div className="shell flex flex-col gap-10">
        <h2 className="m-0 flex items-center gap-4 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-brand">
          SEVENPM
          <span aria-hidden className="h-px flex-1 bg-white/15" />
          About
        </h2>

        <dl className="m-0 grid grid-cols-1 gap-px bg-white/10">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 items-start gap-6 bg-bg-primary py-8 lg:grid-cols-[200px_1fr] lg:gap-16"
              data-reveal="up"
            >
              <dt className="flex flex-col gap-2">
                <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2px] text-content-secondary">
                  {row.label}
                </span>
                <span className="font-daltown text-[clamp(40px,5vw,64px)] uppercase leading-[0.82] text-white">
                  {row.value}
                </span>
              </dt>
              <dd className="m-0 font-[family-name:var(--font-display)] text-[clamp(18px,1.8vw,26px)] font-bold uppercase leading-[1.25] tracking-[-0.01em] text-white">
                <Emphasise text={row.body} phrases={homeStoryHighlights} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
