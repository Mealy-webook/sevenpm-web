import Image from "next/image";
import Link from "next/link";

import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";
import { ScrollRail } from "./ScrollRail";

/**
 * Hospitality packages on the event page, from Figma 2612:5506.
 *
 * Redrawn again. The section is now two stacked parts on the page's own
 * ground — the secondary grey it used to sit on is not in this comp or the
 * last one:
 *
 * - an intro row of two 620 columns: the title and standfirst on the left,
 *   held to 403 and centred on the row's height, and on the right the three
 *   promises from the hospitality page, each a 48 icon beside a card-title
 *   and a line, divided by hairlines;
 * - 48 below, this festival's package cards as a full-width rail. Four at 403 with 32
 *   between come to 1708 on a 1272 column, and the comp cuts the fourth at
 *   the frame edge, so it scrolls and runs to the screen edge.
 *
 * The comp's third promise reads "A dedicated contact One person from our
 * team…" — the title pasted into the body. The body here is the
 * hospitality page's own, without the repeat.
 *
 * All four cards take the yellow CTA. The previous comp gave the fourth a
 * white one, which read as an unfinished state; say the word and it goes
 * white.
 */
export function HospitalitySection({ festival }: { festival: string }) {
  const { from } = hospitalityCopy.packages;
  /* This festival's packages only — the comp's four are Jazzablanca's, and
     Tanjazz VIP has no place on Jazzablanca's page. */
  const packages = hospitalityPackages.filter((entry) => entry.festival === festival);
  if (packages.length === 0) return null;

  return (
    <section
      id="hospitality"
      className="relative scroll-mt-24 overflow-hidden py-16 xl:py-20"
      aria-labelledby="hospitality-title"
    >
      <div className="shell flex flex-col gap-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
          {/* The title column, held to the comp's 403. */}
          <div className="flex flex-col justify-center gap-2">
            <h2
              id="hospitality-title"
              /* 120/100 at the comp's frame, two lines on the 403 measure. */
              className="section-title max-w-[403px] text-white"
              data-reveal="clip"
            >
              Hospitality packages
            </h2>
            <p className="m-0 max-w-[403px] font-[family-name:var(--font-display)] text-[14px] leading-[19px] tracking-[0.15px] text-content-secondary">
              {hospitalityCopy.intro}
            </p>
          </div>

          {/* The three promises */}
          <ul className="m-0 flex list-none flex-col gap-6 p-0" data-reveal="up" data-reveal-stagger>
            {hospitalityCopy.highlights.map((item, index) => (
              <li
                key={item.title}
                className={`flex gap-6 sm:gap-8 ${index > 0 ? "border-t border-white/10 pt-6" : ""}`}
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="size-10 shrink-0 sm:size-12"
                />
                <div className="flex min-w-0 flex-col gap-2">
                  <h3 className="card-title text-white">{item.title}</h3>
                  <p className="m-0 font-[family-name:var(--font-display)] text-[14px] leading-[19px] tracking-[0.15px] text-content-secondary">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* The rail. It runs to the screen edge rather than stopping at the
            shell, which is what the comp draws — so the gutter is padding
            inside the scroller and the overflow is negative margin. On
            desktop the page's scroll slides it, so all four packages come
            past without a sideways swipe; on a phone it is swiped. */}
        <ScrollRail className="-mr-[var(--shell-gutter)] min-w-0 overflow-x-auto pb-2 pr-[var(--shell-gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="m-0 flex list-none gap-8 p-0">
            {packages.map((entry) => (
              <li
                key={entry.slug}
                className="w-[78vw] shrink-0 sm:w-[360px] xl:w-[403px]"
              >
                <article className="flex h-full flex-col border border-white/5 bg-bg-tertiary">
                  <div className="relative aspect-[403/268.667] w-full shrink-0 overflow-hidden bg-[#18181b]">
                    <Image
                      src={entry.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 403px, (min-width: 640px) 360px, 78vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-6 p-8">
                    <div className="flex flex-col gap-2">
                      <h3 className="card-title text-white">
                        {entry.name}
                      </h3>
                      <p className="m-0 font-[family-name:var(--font-ui)] text-[12px] font-bold uppercase leading-4 tracking-[0.12px] text-content-secondary">
                        {entry.summary}
                      </p>
                    </div>

                    <span aria-hidden className="block h-px w-full bg-white/10" />

                    <div className="mt-auto flex flex-col gap-6">
                      <p className="m-0 flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
                        <span className="font-[family-name:var(--font-display)] text-[16px] leading-6 tracking-[0.085px] text-content-primary">
                          {from}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-white">
                          {entry.price}
                        </span>
                        <span className="font-[family-name:var(--font-ui)] text-[14px] leading-[19px] tracking-[0.15px] text-content-secondary">
                          / {entry.perUnit}
                        </span>
                      </p>

                      <Link
                        href={`/hospitality/${entry.slug}`}
                        className="sweep flex w-full items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-[#0b0b0e]"
                      >
                        <span className="relative z-10">Request a quote</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </ScrollRail>
      </div>
    </section>
  );
}
