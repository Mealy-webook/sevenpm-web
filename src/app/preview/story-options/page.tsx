import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HomeStory } from "@/components/home/HomeStory";
import { StoryLedger } from "@/components/home/story/StoryLedger";
import { StoryManifesto } from "@/components/home/story/StoryManifesto";
import { StoryMarquee } from "@/components/home/story/StoryMarquee";
import { StoryStub } from "@/components/home/story/StoryStub";
import { StoryYear } from "@/components/home/story/StoryYear";

export const metadata: Metadata = {
  title: "Story section options — SEVENPM",
  robots: { index: false },
};

const OPTIONS = [
  {
    id: "current",
    label: "Current",
    note: "Two photographs at opposing angles with peelable stickers, statement centred underneath.",
    node: <HomeStory />,
  },
  {
    id: "manifesto",
    label: "A · Manifesto",
    note: "The statement at display size, ranged left, with the year, the country and the claim flooded brand. Nothing else on the screen.",
    node: <StoryManifesto />,
  },
  {
    id: "ledger",
    label: "B · Ledger",
    note: "The numbers section's press-sheet, applied to words: hairline rows, a label column, one sentence each.",
    node: <StoryLedger />,
  },
  {
    id: "marquee",
    label: "C · Marquee",
    note: "Two bands of kinetic type running opposite ways with the statement held between them. The movement replaces the photographs.",
    node: <StoryMarquee />,
  },
  {
    id: "stub",
    label: "D · Stub",
    note: "The statement printed on a torn-off ticket — brand stock, perforated edge, barcode. All drawn in CSS.",
    node: <StoryStub />,
  },
  {
    id: "year",
    label: "E · Year",
    note: "2018 at poster size, outlined in brand, with the statement set against it.",
    node: <StoryYear />,
  },
];

/**
 * Every version of the story section on one page, live and full width, so
 * they can be compared by scrolling rather than by opening six tabs.
 *
 * Review chrome — it goes when the choice is made.
 */
export default function StoryOptionsPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <section className="relative py-12">
          <div className="shell flex flex-col gap-3">
            <h1 className="m-0 font-daltown text-[clamp(40px,6vw,88px)] uppercase leading-[0.9] text-white">
              Story section
            </h1>
            <p className="m-0 max-w-[680px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-secondary">
              Five versions without photographs, and the current one at the top
              for comparison. Same words in all six — nothing here is new copy.
            </p>
            <nav className="mt-2 flex flex-wrap gap-2">
              {OPTIONS.map((option) => (
                <a
                  key={option.id}
                  href={`#${option.id}`}
                  className="flex h-9 items-center border border-white/15 px-3 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[1.5px] text-content-secondary transition-colors hover:border-brand hover:text-brand"
                >
                  {option.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {OPTIONS.map((option) => (
          <div key={option.id} id={option.id} className="scroll-mt-28">
            <div className="shell flex flex-col gap-1 border-t border-white/10 pt-6">
              <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[2px] text-brand">
                {option.label}
              </span>
              <span className="max-w-[720px] font-[family-name:var(--font-display)] text-[13px] leading-5 text-content-secondary">
                {option.note}
              </span>
            </div>
            {option.node}
          </div>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
