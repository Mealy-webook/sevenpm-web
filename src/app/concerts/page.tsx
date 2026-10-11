import type { Metadata } from "next";
import Link from "next/link";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PageBlocks } from "@/components/pages/PageBlocks";
import { PageIntro } from "@/components/pages/PageIntro";
import { concertsCopy, eventsCopy } from "@/data/pages";

export const metadata: Metadata = {
  title: "Concerts — SEVENPM",
  description: concertsCopy.intro,
};

/**
 * `/concerts`. No comp — the menu asked for it.
 *
 * There is no concert data in the project, so the programme renders as an
 * honest empty state rather than as invented shows. Fill `concertsCopy.shows`
 * and the list takes over from the notice on its own.
 */
export default function ConcertsPage() {
  const { shows } = concertsCopy;

  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow={concertsCopy.eyebrow}
          title={concertsCopy.title}
          intro={concertsCopy.intro}
        />

        <section className="relative py-8 xl:py-12">
          <div className="shell">
            {shows.length === 0 ? (
              <div
                data-reveal="up"
                className="flex flex-col items-start gap-4 border-t border-white/10 py-10"
              >
                <p className="m-0 font-[family-name:var(--font-display)] text-[20px] font-bold uppercase leading-7 tracking-[-0.11px] text-white sm:text-[24px]">
                  {eventsCopy.empty}
                </p>
                <Link
                  href="/#newsletter"
                  className="link-sweep font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-6 tracking-[1.56px] text-brand"
                >
                  Join the newsletter
                </Link>
              </div>
            ) : (
              <ul className="m-0 flex list-none flex-col p-0">
                {shows.map((show) => (
                  <li
                    key={`${show.name}-${show.when}`}
                    data-reveal="up"
                    className="border-t border-white/10"
                  >
                    <Link
                      href={show.href}
                      className="flex flex-col gap-1 py-6 md:flex-row md:items-baseline md:gap-8"
                    >
                      <span className="w-48 shrink-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-brand">
                        {show.when}
                      </span>
                      <span className="flex-1 font-[family-name:var(--font-display)] text-[24px] font-black uppercase leading-[1.05] tracking-[-0.01em] text-white sm:text-[30px]">
                        {show.name}
                      </span>
                      <span className="font-[family-name:var(--font-ui)] text-[15px] leading-[1.6] text-content-secondary">
                        {show.venue}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <PageBlocks blocks={concertsCopy.blocks} />
      </main>
      <SiteFooter />
    </>
  );
}
