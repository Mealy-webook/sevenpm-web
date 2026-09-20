import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { FestivalsStage } from "@/components/home/FestivalsStage";
import { HomeHero } from "@/components/home/HomeHero";
import { Chapter } from "@/components/home/redesign/Chapter";
import { ChapterRail, type ChapterRef } from "@/components/home/redesign/ChapterRail";
import { PreviewSwitch } from "@/components/home/redesign/PreviewSwitch";
import { StatsStrip } from "@/components/home/redesign/StatsStrip";
import { WordMarquee } from "@/components/home/redesign/WordMarquee";
import { jazzablanca } from "@/data/events";
import { festivals, homeCopy, homeStory, newsItems } from "@/data/home";

export const metadata: Metadata = {
  title: "Homepage option B — Editorial — SEVENPM",
  robots: { index: false },
};

const CHAPTERS: ChapterRef[] = [
  { id: "festivals", number: "01", title: "Festivals" },
  { id: "story", number: "02", title: "Story" },
  { id: "news", number: "03", title: "News" },
  { id: "join", number: "04", title: "Join" },
];

/**
 * Homepage, option B: a magazine. After the hero the page is four numbered
 * chapters, each a screen on a full-bleed photograph with the type on the
 * page's ground; an index down the left edge says where you are. Fewer
 * sections than `/`: the figures live inside the story, the headlines run
 * as a ticker over the news, and the gallery is gone — the photographs are
 * the chapters' backgrounds instead.
 */
export default function HomeEditorialPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <ChapterRail chapters={CHAPTERS} />
      <main>
        <HomeHero />

        <Chapter
          id="festivals"
          number="01"
          title="Festivals"
          image="/assets/gallery-4.jpg"
        >
          <div className="[overflow-x:clip] -mx-[var(--shell-gutter)]">
            <FestivalsStage festivals={festivals} />
          </div>
        </Chapter>

        <Chapter
          id="story"
          number="02"
          title="Story"
          image="/assets/gallery-2.jpg"
        >
          <div className="flex flex-col gap-12">
            <p
              className="m-0 max-w-[980px] font-[family-name:var(--font-display)] text-[22px] font-black uppercase leading-[1.25] tracking-[-0.2px] text-white xl:text-[34px]"
              data-split="lines"
            >
              {homeStory.body}
            </p>
            <StatsStrip />
            <nav
              aria-label="SEVENPM social accounts"
              className="flex flex-wrap gap-3"
              data-reveal="up"
              data-reveal-stagger
            >
              {homeStory.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="btn-secondary flex size-[58px] items-center justify-center"
                >
                  <Image
                    src={social.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </a>
              ))}
            </nav>
          </div>
        </Chapter>

        <Chapter
          id="news"
          number="03"
          title="News"
          image="/assets/gallery-6.jpg"
        >
          <div className="flex flex-col gap-12">
            {/* The headlines as a ticker, the way a newsroom runs them. */}
            <WordMarquee
              words={newsItems.map((item) => item.title)}
              tone="solid"
              size="sm"
              speed={80}
              className="-mx-[var(--shell-gutter)] border-y border-white/10 py-3"
            />
            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {newsItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-cursor="Read"
                  data-reveal="up"
                  data-reveal-delay={0.08 * index}
                  className={`news-row group flex flex-col gap-4 md:pr-8 ${
                    index > 0 ? "md:border-l md:border-white/10 md:pl-8" : ""
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-4">
                    <time className="font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase leading-5 tracking-[1.2px] text-brand">
                      {item.date}
                    </time>
                    <span className="font-daltown text-[28px] leading-none text-white/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[20px] font-bold uppercase leading-7 tracking-[-0.11px] text-white transition-colors group-hover:text-brand xl:text-[22px]">
                    {item.title}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[15px] leading-6 tracking-[0.15px] text-content-secondary">
                    {item.excerpt}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/news"
              className="sweep flex items-center justify-center self-start border-[1.5px] border-text-secondary px-8 py-5 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-none text-white transition-colors hover:border-white"
              data-magnetic="0.2"
              data-reveal="up"
            >
              <span className="relative z-10">All news</span>
            </Link>
          </div>
        </Chapter>

        <Chapter
          id="join"
          number="04"
          title="Join"
          image="/assets/gallery-1.jpg"
        >
          <div className="flex max-w-[760px] flex-col gap-8">
            <h3 className="m-0 font-[family-name:var(--font-display)] text-[28px] font-black uppercase leading-[1.05] text-brand xl:text-[44px]">
              {homeCopy.newsletter.title}
            </h3>
            <p
              className="m-0 font-[family-name:var(--font-display)] text-[17px] leading-[1.6] text-content-secondary"
              data-split="lines"
            >
              {homeCopy.newsletter.body}
            </p>
            <div className="flex flex-wrap items-center gap-4" data-reveal="up">
              <a
                href="#join"
                data-magnetic="0.25"
                className="lift inline-flex items-center bg-brand px-8 py-5 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-none text-[#18181b] transition-colors hover:bg-white"
              >
                {homeCopy.newsletter.cta}
              </a>
              <Link
                href={`/events/${jazzablanca.slug}`}
                className="btn-secondary inline-flex items-center px-8 py-5 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-none text-white"
              >
                Next up: {jazzablanca.name}
              </Link>
            </div>
          </div>
        </Chapter>

        <SponsorsSection event={jazzablanca} />
      </main>
      <SiteFooter />
      <PreviewSwitch />
    </>
  );
}
