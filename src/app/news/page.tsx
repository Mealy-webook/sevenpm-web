import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsList } from "@/components/news/NewsList";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Scribble } from "@/components/home/Scribble";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { newsArticles, newsCopy } from "@/data/news";

export const metadata: Metadata = {
  title: "News — SEVENPM",
  description: newsCopy.description,
};

/** `/news`. No Figma comp — the homepage's news block as a full index. */
export default function NewsPage() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <section className="relative py-10 xl:py-16">
          <div className="shell flex flex-col gap-10">
            <div className="relative w-full">
              <DisplayHeading as="h1" align="left" reveal="clip">
                {newsCopy.title}
              </DisplayHeading>
              {/* The homepage's loop, parked over the end of the heading */}
              <div
                className="pointer-events-none absolute hidden xl:block"
                style={{ left: 430, top: -30, width: 422.63, height: 275.1 }}
                aria-hidden
              >
                <Scribble />
              </div>
            </div>
            <p
              className="m-0 max-w-[720px] font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary"
              data-split="lines"
            >
              {newsCopy.description}
            </p>

            <NewsList articles={newsArticles} />
          </div>
        </section>

        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
