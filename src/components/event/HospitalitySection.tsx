import Image from "next/image";
import Link from "next/link";

import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Hospitality packages on the event page, from Figma 2549:17634.
 *
 * The comp's order: the title at Daltown 140/118 centred, the standfirst on
 * a 638 measure under it, the three promises in a row divided by hairlines,
 * then the package cards.
 *
 * Four cards at 403 with 32 between them come to 1708 against a 1272
 * column, and the comp shows the fourth cut off at the frame edge. That is a
 * rail, not a grid, so it scrolls sideways — which is also the only way four
 * cards of this depth work on anything narrower than the comp.
 *
 * This is the event page's version. The full `/hospitality` page carries the
 * same packages at length; here the section is the trailer for it, so each
 * card leads to its own page and the heading leads to the index.
 */
export function HospitalitySection() {
  const { from } = hospitalityCopy.packages;

  return (
    <section
      id="hospitality"
      className="relative scroll-mt-24 py-16 xl:py-20"
      aria-labelledby="hospitality-title"
    >
      <div className="shell flex flex-col items-center gap-10 xl:gap-12">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2
            id="hospitality-title"
            /* 140/118 at the comp's frame, with the site's display trim and a
               cap so it never runs off a narrow screen. */
            className="m-0 font-daltown text-[clamp(38px,9vw,126px)] uppercase leading-[0.84] tracking-[0.03em] text-white"
            data-reveal="clip"
          >
            Hospitality packages
          </h2>
          <p className="m-0 max-w-[638px] font-[family-name:var(--font-ui)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
            {hospitalityCopy.intro}
          </p>
        </div>

        {/* The three promises, divided by hairlines as the comp draws them.
            The rules become horizontal once the row stacks — a vertical
            divider between stacked blocks divides nothing. */}
        <ul className="m-0 grid w-full list-none grid-cols-1 gap-0 p-0 md:grid-cols-3">
          {hospitalityCopy.highlights.map((item, index) => (
            <li
              key={item.title}
              data-reveal="up"
              className={`flex flex-col gap-2 py-5 md:py-0 ${
                index === 0
                  ? "border-t border-white/10 md:border-t-0"
                  : "border-t border-white/10 md:border-l md:border-t-0 md:pl-8"
              } ${index !== 0 ? "md:ml-0" : ""} md:pr-8`}
            >
              <h3 className="m-0 font-daltown text-[clamp(26px,3.6vw,56px)] uppercase leading-[0.94] tracking-[0.03em] text-white">
                {item.title}
              </h3>
              <p className="m-0 font-[family-name:var(--font-ui)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        {/* The rail. Full bleed with the shell's gutter as padding, so the
            last card can reach the edge of the screen and the first still
            lines up with the heading. */}
        <div className="-mx-[var(--shell-gutter)] w-screen max-w-[calc(100%+2*var(--shell-gutter))] overflow-x-auto px-[var(--shell-gutter)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="m-0 flex list-none gap-8 p-0">
            {hospitalityPackages.map((entry) => (
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
                      <h3 className="m-0 font-daltown text-[clamp(32px,4vw,72px)] uppercase leading-[0.84] tracking-[0.02em] text-white">
                        {entry.name}
                      </h3>
                      <p className="m-0 font-[family-name:var(--font-ui)] text-[12px] font-bold uppercase leading-4 tracking-[0.12px] text-content-secondary">
                        {entry.summary}
                      </p>
                    </div>

                    <span aria-hidden className="block h-px w-full bg-white/10" />

                    <div className="mt-auto flex flex-col gap-6">
                      {/* "From 50 MAD / Box in night" — the price set on one
                          baseline, the unit stepping down beside it. */}
                      <p className="m-0 flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
                        <span className="font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-primary">
                          {from}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-white">
                          {entry.price}
                        </span>
                        <span className="font-[family-name:var(--font-ui)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
                          / {entry.perUnit}
                        </span>
                      </p>

                      {/* White, as the comp draws it: the primary action on a
                          dark card, and the brand yellow belongs to the page
                          around it. */}
                      <Link
                        href={`/hospitality/${entry.slug}`}
                        className="flex w-full items-center justify-center bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-brand"
                      >
                        Request a quote
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/hospitality"
          className="link-sweep font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-6 tracking-[1.56px] text-white"
        >
          All hospitality packages
        </Link>
      </div>
    </section>
  );
}
