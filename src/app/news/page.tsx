import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsList } from "@/components/news/NewsList";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { newsArticles, newsCopy } from "@/data/news";

export const metadata: Metadata = {
  title: "News — SEVENPM",
  description: newsCopy.description,
};

/**
 * `/news` — Figma 2231:12107.
 *
 * The title centred at display size over the grid, and nothing else: the
 * comp drops the standfirst and the category chips the page used to carry.
 */
export default function NewsPage() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <section className="relative py-12 xl:py-20">
          <div className="shell flex flex-col items-center gap-12">
            <DisplayHeading as="h1" align="center" reveal="clip">
              {newsCopy.title}
            </DisplayHeading>

            <div className="w-full">
              <NewsList articles={newsArticles} />
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
