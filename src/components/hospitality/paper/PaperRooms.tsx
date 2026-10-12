import Image from "next/image";
import Link from "next/link";

import { hospitalityPackages, paperCopy } from "@/data/hospitality";
import { Rule } from "./PaperSections";

/**
 * The five rooms, as plates in a brochure.
 *
 * A numbered index down the page: the figure, the picture, the name, and
 * the terms on one ruled line. Nothing is a card and nothing has a border —
 * the rules do all the dividing, which is what makes a printed page read as
 * printed rather than as an interface.
 *
 * The pictures are portrait and held to a column rather than bleeding: this
 * page's argument is restraint, and a full-bleed photograph would be the
 * other design.
 */
export function PaperRooms() {
  const { rule, title, note } = paperCopy.spaces;

  return (
    <section id="spaces" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-10">
        <Rule>{rule}</Rule>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <h2
            className="m-0 font-daltown text-[clamp(28px,4.69vw,75px)] uppercase leading-[0.88] text-[#16161a]"
            data-reveal="clip"
          >
            {title}
          </h2>
          <p className="m-0 max-w-[460px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.75] text-[#16161a]/65">
            {note}
          </p>
        </div>

        <ol className="m-0 flex list-none flex-col p-0">
          {hospitalityPackages.map((entry, index) => (
            <li key={entry.slug} data-reveal="up">
              <Link
                href={`/hospitality/${entry.slug}`}
                className="paper-rule group grid gap-5 py-8 sm:grid-cols-[52px_minmax(0,210px)_1fr] sm:gap-8 xl:py-10"
              >
                {/* The plate number. */}
                <span className="font-[family-name:var(--font-display)] text-[13px] font-bold uppercase leading-5 tabular-nums tracking-[2px] text-[#16161a]/40">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="relative block aspect-[3/4] w-full max-w-[210px] overflow-hidden bg-[#16161a]/5">
                  <Image
                    src={entry.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 210px, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </span>

                <span className="flex flex-col gap-3">
                  <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[3px] text-[#16161a]/45">
                    {entry.festival}
                  </span>

                  <span className="font-daltown text-[clamp(23px,3.38vw,49px)] uppercase leading-[0.9] text-[#16161a] transition-opacity group-hover:opacity-70">
                    {entry.name}
                  </span>

                  <span className="max-w-[460px] font-[family-name:var(--font-ui)] text-[14px] leading-[1.75] text-[#16161a]/65">
                    {entry.summary}
                  </span>

                  {/* The terms, on one ruled line. */}
                  <span className="paper-rule mt-2 flex flex-wrap gap-x-10 gap-y-3 pt-3">
                    {[
                      { label: "Holds", value: entry.capacity },
                      { label: "From", value: entry.price },
                      { label: "Per", value: entry.perUnit },
                    ].map((term) => (
                      <span key={term.label} className="flex flex-col gap-0.5">
                        <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2px] text-[#16161a]/40">
                          {term.label}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-[#16161a]">
                          {term.value}
                        </span>
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            </li>
          ))}
          <li className="paper-rule" />
        </ol>
      </div>
    </section>
  );
}
