import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { NewsCard } from "@/components/news/NewsCard";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { getArticle, newsArticles, newsCopy } from "@/data/news";
import { socialLinks } from "@/data/events";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "News — SEVENPM" };
  return {
    title: `${article.title} — SEVENPM`,
    description: article.excerpt,
    openGraph: { images: [article.image] },
  };
}

/**
 * A news article — Figma 2231:12162.
 *
 * The headline is set in Daltown at 88 over a 729px measure, the lead
 * photograph runs the full 1272 column at 3:1, and the body sits in an 836px
 * measure with the share list in the remaining column. The comp shows no
 * category on the story itself — the date and the reading time carry the
 * meta line.
 */
export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const [lead, ...rest] = article.body;
  const more = newsArticles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <article className="shell flex flex-col gap-12 py-12 xl:py-20">
          <Link
            href="/news"
            className="news-tile group flex w-fit items-center gap-2 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary transition-colors hover:text-brand"
          >
            <span
              aria-hidden
              className="news-tile-arrow news-tile-arrow--back"
            />
            {newsCopy.backToNews}
          </Link>

          <header className="flex w-full flex-col gap-4 lg:max-w-[729px]">
            <p className="m-0 font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
              <time dateTime={article.date}>{article.dateLabel}</time> —{" "}
              {article.readingTime}
            </p>
            <DisplayHeading
              as="h1"
              align="left"
              reveal="clip"
              className="display-text--article"
            >
              {article.title}
            </DisplayHeading>
          </header>

          <div
            className="relative aspect-[16/9] w-full overflow-hidden bg-[#27272a] lg:aspect-[1272/426]"
            data-reveal="scale"
          >
            <Image
              src={article.image}
              alt=""
              fill
              sizes="(min-width: 1512px) 1272px, 100vw"
              priority
              className="object-cover"
            />
          </div>

          <div className="flex w-full flex-col gap-12 lg:flex-row">
            <div className="flex min-w-0 flex-col gap-12 lg:w-[836px] lg:shrink-0">
              <p
                className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white"
                data-split="lines"
              >
                {lead}
              </p>
              <div className="flex flex-col gap-5">
                {rest.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary"
                    data-reveal="up"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <aside className="flex min-w-0 flex-1 flex-col gap-6">
              <h2 className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-secondary">
                Share
              </h2>
              <div className="flex flex-wrap gap-4">
                {/* The comp lists six: everything the footer carries
                    except X, which it leaves off. */}
                {socialLinks
                  .filter((link) => link.label !== "X")
                  .map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-sweep font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-[1.2] tracking-[1.56px] text-text-primary transition-colors hover:text-brand"
                    >
                      {link.label}
                    </a>
                  ))}
              </div>
            </aside>
          </div>
        </article>

        {/* More from the newsroom — the index's own tiles, three across. */}
        <section className="relative py-12 xl:py-20">
          <div className="shell flex flex-col gap-12">
            <DisplayHeading
              as="h2"
              align="left"
              reveal="clip"
              className="display-text--article"
            >
              {newsCopy.related}
            </DisplayHeading>
            <ul
              className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 xl:grid-cols-3"
              data-reveal="up"
              data-reveal-stagger
            >
              {more.map((item) => (
                <li key={item.slug}>
                  <NewsCard article={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
