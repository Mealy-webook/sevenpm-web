import type { Metadata } from "next";
import Link from "next/link";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TeamGrid } from "@/components/about/TeamGrid";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { StickerPeel } from "@/components/ui/StickerPeel";
import { aboutCopy, stats, team } from "@/data/about";
import { jobRoles } from "@/data/careers";

export const metadata: Metadata = {
  title: "Team — SEVENPM",
  description: aboutCopy.team.body,
};

/**
 * `/team`. No Figma comp — the About page's team block given a page of its
 * own, since the menu links straight to it: the display heading, the crew,
 * and the way into careers.
 */
export default function TeamPage() {
  const founded = stats.find((s) => s.value === 2018);

  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1512px] xl:block"
            aria-hidden
          >
            <StickerPeel
              className="pointer-events-auto"
              imageSrc="/assets/sticker-smiley.png"
              width={150}
              height={150}
              initialPosition={{ x: 1180, y: 40 }}
              peelBackHoverPct={22}
              peelBackActivePct={34}
              shadowIntensity={0.6}
              lightingIntensity={0.12}
            />
          </div>
          <div className="shell flex flex-col gap-10 pb-12 pt-6 xl:gap-12 xl:pt-16">
            <p
              className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-brand"
              data-reveal="up"
            >
              {founded
                ? `${team.length} people · ${founded.label}`
                : "The crew"}
            </p>
            <DisplayHeading as="h1" align="left" reveal="clip">
              {aboutCopy.team.title}
            </DisplayHeading>
            <p
              className="m-0 max-w-[720px] font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white lg:text-[28px] lg:leading-9"
              data-split="lines"
              data-reveal-delay="0.1"
            >
              {aboutCopy.team.body}
            </p>
          </div>
        </section>

        <section className="relative py-8 xl:py-12">
          <div className="shell">
            <TeamGrid members={team} />
          </div>
        </section>

        <section className="relative bg-ink-900 py-16 xl:py-24">
          <div
            className="shell flex flex-col items-start gap-6"
            data-reveal="up"
          >
            <h2 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-brand sm:text-[48px]">
              Want in?
            </h2>
            <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
              {`${jobRoles.length} roles are open across production, communications and support.`}
            </p>
            <Link
              href="/careers"
              data-magnetic="0.2"
              className="sweep flex items-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#0b0b0e]"
            >
              <span className="relative z-10">See open roles</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
