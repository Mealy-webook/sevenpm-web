import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PageIntro } from "@/components/pages/PageIntro";
import { festivals, festivalsRowOrder } from "@/data/home";
import { concertsCopy, eventsCopy } from "@/data/pages";

export const metadata: Metadata = {
  title: "Upcoming events — SEVENPM",
  description: eventsCopy.intro,
};

/**
 * `/events`. No comp — the menu asked for it.
 *
 * The festivals are the ones in `data/home.ts`, in the row's own order, drawn
 * as upright cards rather than the homepage's scrubbed row: this is an index,
 * and an index should sit still and be read. Two are on: Jazzablanca and
 * Tanjazz.
 *
 * Only a festival with a real event page is a link. Tanjazz has none yet, so
 * its card has no destination — the truth, and better than a link to `#`.
 */
export default function EventsPage() {
  const ordered = festivalsRowOrder
    .map((id) => festivals.find((festival) => festival.id === id))
    .filter((festival) => festival !== undefined);

  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow={eventsCopy.eyebrow}
          title={eventsCopy.title}
          intro={eventsCopy.intro}
        />

        <section className="relative py-8 xl:py-12">
          <div className="shell grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {ordered.map((festival) => {
              const live = festival.href !== "#";
              const card = (
                <>
                  <span className="relative block aspect-[2/3] w-full overflow-hidden bg-ink-900">
                    {festival.card ? (
                      <Image
                        src={festival.card}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : null}
                  </span>
                  <span className="mt-4 block font-[family-name:var(--font-display)] text-[19px] font-black uppercase leading-[1.05] tracking-[-0.01em] text-white">
                    {festival.name}
                  </span>
                  <span className="mt-1 block font-[family-name:var(--font-ui)] text-[13px] leading-[1.6] text-content-secondary">
                    {[festival.when, festival.city]
                      .filter(Boolean)
                      .join(" · ") || "Dates to be announced"}
                  </span>
                  <span className="mt-2 block font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-brand">
                    {live ? "Tickets on sale" : "Announced soon"}
                  </span>
                </>
              );

              return live ? (
                <Link
                  key={festival.id}
                  href={festival.href}
                  data-reveal="up"
                  className="group block"
                >
                  {card}
                </Link>
              ) : (
                <div key={festival.id} data-reveal="up" className="group block">
                  {card}
                </div>
              );
            })}
          </div>
        </section>

        {/* The concert strand, pointed at rather than repeated. */}
        <section className="relative py-8 xl:py-12">
          <div className="shell flex flex-col items-start gap-4 border-t border-white/10 pt-10">
            <h2 className="m-0 font-[family-name:var(--font-display)] text-[21px] font-black uppercase leading-[1.05] tracking-[-0.01em] text-white sm:text-[26px]">
              {concertsCopy.title}
            </h2>
            <p className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.7] text-content-secondary">
              {concertsCopy.intro}
            </p>
            <Link
              href="/concerts"
              className="link-sweep font-[family-name:var(--font-display)] text-[14px] font-semibold uppercase leading-6 tracking-[1.56px] text-brand"
            >
              See the concert programme
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
