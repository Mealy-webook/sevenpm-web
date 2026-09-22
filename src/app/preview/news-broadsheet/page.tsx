import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { NewsBroadsheet } from "@/components/news/options/NewsBroadsheet";
import { NewsSwitch } from "@/components/news/options/NewsSwitch";
import { newsArticles, newsCopy } from "@/data/news";

export const metadata: Metadata = {
  title: "News option A — Broadsheet — SEVENPM",
  robots: { index: false },
};

/** News option A: a front page. The newest story runs full width with its photograph; the rest is a numbered, ruled index two to a row. */
export default function NewsBroadsheetPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <section className="relative py-10 xl:py-16">
          <div className="shell flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <DisplayHeading as="h1" align="left" reveal="clip">
                {newsCopy.title}
              </DisplayHeading>
              <p className="m-0 max-w-[720px] font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
                {newsCopy.description}
              </p>
            </div>

            <NewsBroadsheet articles={newsArticles} />
          </div>
        </section>

        <NewsletterSection />
      </main>
      <SiteFooter />
      <NewsSwitch />
    </>
  );
}
