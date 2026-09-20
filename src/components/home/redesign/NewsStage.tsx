import Image from "next/image";
import Link from "next/link";

import type { NewsItem } from "@/data/home";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Scribble } from "@/components/home/Scribble";

/**
 * News as an editorial spread, one screen: the latest story large on the
 * left with its photograph, the two before it stacked on the right with
 * hairlines between, and the way to the rest underneath. Same three items
 * `NewsSection` lists; here the newest is the lead.
 */
export function NewsStage({ items }: { items: NewsItem[] }) {
  const [lead, ...rest] = items;
  if (!lead) return null;

  return (
    <section id="news" className="section-screen relative py-16 xl:py-24">
      <div className="shell flex flex-col gap-12">
        <div className="relative w-full">
          <DisplayHeading reveal="clip" align="left">
            Latest news
          </DisplayHeading>
          <div
            className="pointer-events-none absolute hidden xl:block"
            style={{ left: 629.38, top: -42.89, width: 422.63, height: 275.1 }}
            aria-hidden
          >
            <Scribble />
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          <Link
            href={lead.href}
            data-cursor="Read"
            data-reveal="up"
            className="news-row group flex flex-col gap-6"
          >
            <span className="relative block aspect-[16/10] w-full overflow-hidden bg-[#27272a]">
              {lead.image && (
                <Image
                  src={lead.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="news-image object-cover"
                />
              )}
            </span>
            <span className="flex flex-col gap-3">
              <time className="font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase leading-5 tracking-[1.2px] text-brand">
                {lead.date}
              </time>
              <span className="font-[family-name:var(--font-display)] text-[26px] font-black uppercase leading-[1.1] tracking-[-0.3px] text-white transition-colors group-hover:text-brand xl:text-[36px]">
                {lead.title}
              </span>
              <span className="max-w-[640px] font-[family-name:var(--font-display)] text-[15px] leading-6 tracking-[0.15px] text-content-secondary">
                {lead.excerpt}
              </span>
            </span>
          </Link>

          <div className="flex flex-col justify-between gap-8">
            <ul className="m-0 flex list-none flex-col p-0">
              {rest.map((item, index) => (
                <li
                  key={item.href}
                  className={index > 0 ? "border-t border-white/10" : undefined}
                >
                  <Link
                    href={item.href}
                    data-cursor="Read"
                    data-reveal="up"
                    data-reveal-delay={0.08 * index}
                    className="news-row group flex flex-col gap-3 py-7"
                  >
                    <time className="font-[family-name:var(--font-display)] text-[12px] leading-5 tracking-[0.12px] text-content-secondary">
                      {item.date}
                    </time>
                    <span className="font-[family-name:var(--font-display)] text-[20px] font-bold uppercase leading-7 tracking-[-0.11px] text-white transition-colors group-hover:text-brand xl:text-[22px]">
                      {item.title}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-[15px] leading-6 tracking-[0.15px] text-content-secondary">
                      {item.excerpt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/news"
              className="sweep flex items-center justify-center self-start border-[1.5px] border-text-secondary px-8 py-5 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-none text-white transition-colors hover:border-white"
              data-magnetic="0.2"
              data-reveal="up"
            >
              <span className="relative z-10">All news</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
