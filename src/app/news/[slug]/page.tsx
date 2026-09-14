import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
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
 * A news article. No Figma comp — set in the site's own type: the meta line
 * and headline over a full-bleed lead image, then a single measure of body
 * copy, the share row, and the rest of the newsroom underneath.
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
        <article>
          <header className="shell flex flex-col gap-8 pb-10 pt-6 xl:pt-12">
            <Link
              href="/news"
              className="link-sweep self-start font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-secondary transition-colors hover:text-brand"
            >
              ← {newsCopy.backToNews}
            </Link>

            <div className="flex flex-wrap items-center gap-3 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-brand">
              {article.category}
              <span aria-hidden className="text-content-secondary">
                ·
              </span>
              <time dateTime={article.date} className="text-content-secondary">
                {article.dateLabel}
              </time>
              <span aria-hidden className="text-content-secondary">
                ·
              </span>
              <span className="text-content-secondary">
                {article.readingTime}
              </span>
            </div>

            <h1
              className="m-0 max-w-[1100px] font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-[48px] xl:text-[64px]"
              data-reveal="clip"
            >
              {article.title}
            </h1>
          </header>

          <div className="shell">
            <div
              className="relative aspect-[16/9] w-full overflow-hidden"
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
          </div>

          <div className="shell flex flex-col gap-12 py-12 lg:flex-row lg:gap-16">
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <p
                className="m-0 max-w-[760px] font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-8 tracking-[-0.11px] text-white"
                data-split="lines"
              >
                {lead}
              </p>
              {rest.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="m-0 max-w-[760px] font-[family-name:var(--font-display)] text-[17px] leading-7 tracking-[0.085px] text-content-secondary"
                  data-reveal="up"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <aside className="flex shrink-0 flex-col gap-4 lg:w-[220px]">
              <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-secondary">
                Share
              </span>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {socialLinks.slice(0, 4).map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-sweep font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-text-primary transition-colors hover:text-brand"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </article>

        {/* More from the newsroom */}
        <section className="relative bg-ink-900 py-16 xl:py-24">
          <div className="shell flex flex-col gap-8">
            <h2 className="m-0 font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-content-primary">
              {newsCopy.related}
            </h2>
            <ul
              className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3"
              data-reveal="up"
              data-reveal-stagger
            >
              {more.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/news/${item.slug}`}
                    data-cursor="Read"
                    className="group flex h-full flex-col gap-4 border border-white/5 p-6 transition-colors hover:border-white/20"
                  >
                    <span className="relative block aspect-[16/10] w-full overflow-hidden bg-ink-700">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 30vw, 90vw"
                        className="news-image object-cover"
                      />
                    </span>
                    <time
                      dateTime={item.date}
                      className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary"
                    >
                      {item.dateLabel}
                    </time>
                    <span className="font-[family-name:var(--font-display)] text-[17px] font-bold uppercase leading-6 tracking-[-0.09px] text-white transition-colors group-hover:text-brand">
                      {item.title}
                    </span>
                  </Link>
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
