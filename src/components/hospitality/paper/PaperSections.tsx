import Link from "next/link";
import Image from "next/image";

import {
  hospitalityCopy,
  hospitalityPackages,
  paperCopy,
} from "@/data/hospitality";
import { jazzablanca } from "@/data/events";

/* Shared furniture ------------------------------------------------- */

/** The rule-and-label that opens every section, the way a printed page
 *  announces a new part. */
export function Rule({ children }: { children: React.ReactNode }) {
  return (
    <div className="paper-rule flex items-baseline gap-4 pt-4">
      <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[3px] text-[#16161a]/55">
        {children}
      </span>
    </div>
  );
}

/* Hero -------------------------------------------------------------- */

/**
 * The opening.
 *
 * No photograph behind the title and nothing moving: the whole argument of
 * this design is that this is the quiet page, and a full-bleed hero would
 * have made the same noise as everywhere else. One picture sits beside the
 * title at a modest size, which is how an expensive brochure uses a
 * photograph — sparingly, so it counts.
 */
export function PaperHero() {
  const { rule, title, standfirst, meta } = paperCopy.hero;

  return (
    <section className="relative pt-10 xl:pt-16">
      <div className="shell flex flex-col gap-10">
        <Rule>{rule}</Rule>

        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16">
          <div className="flex flex-col gap-7">
            <h1
              className="m-0 max-w-[12ch] font-daltown text-[clamp(37px,7.66vw,126px)] uppercase leading-[0.84] text-[#16161a]"
              data-reveal="clip"
            >
              {title}
            </h1>
            <p
              className="m-0 max-w-[560px] font-[family-name:var(--font-ui)] text-[16px] leading-[1.75] text-[#16161a]/70 sm:text-[17px]"
              data-split="lines"
            >
              {standfirst}
            </p>
          </div>

          {/* The one picture, held square and small. */}
          <div className="relative aspect-[4/5] w-full overflow-hidden lg:max-w-[380px] lg:justify-self-end">
            <Image
              src={hospitalityCopy.heroImage}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 380px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* The standing facts, as a printed colophon. */}
        <dl className="m-0 grid grid-cols-1 gap-0 sm:grid-cols-3">
          {meta.map((item) => (
            <div
              key={item.label}
              className="paper-rule flex flex-col gap-1 py-4 sm:pr-8"
            >
              <dt className="m-0 font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[3px] text-[#16161a]/45">
                {item.label}
              </dt>
              <dd className="m-0 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-[#16161a]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* The argument ------------------------------------------------------ */

/**
 * The case, set as an editorial opening: a drop cap, a measure narrow
 * enough to read, and a closing line given its own weight.
 */
export function PaperArgument() {
  const { rule, lead, body } = paperCopy.argument;

  return (
    <section className="relative py-14 xl:py-20">
      <div className="shell flex flex-col gap-8">
        <Rule>{rule}</Rule>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <p className="paper-opening m-0 font-[family-name:var(--font-ui)] text-[17px] leading-[1.8] text-[#16161a] sm:text-[18px]">
            {lead}
          </p>

          <div className="flex flex-col gap-5">
            {body.map((paragraph, index) => (
              <p
                key={index}
                className={`m-0 font-[family-name:var(--font-ui)] leading-[1.8] ${
                  index === body.length - 1
                    ? "font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-[1.25] tracking-[0.01em] text-[#16161a] sm:text-[23px]"
                    : "text-[16px] text-[#16161a]/70"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* The evening ------------------------------------------------------- */

const ORDER = [
  { time: "Before", body: "You tell us the night and the number; we quote on it. Nothing is paid online." },
  { time: "19:00", body: "Your guests arrive at their own entrance and are met by name." },
  { time: "20:00", body: "Drinks poured, food out, the first act on." },
  { time: "22:00", body: "The headline set, from a space your party has had all evening." },
  { time: "00:00", body: "Last call. Parking is held on site." },
];

/**
 * The running order as a printed timetable: hours ruled against entries,
 * small, factual, no ornament. The loud version of this belongs to the other
 * design; here it is the back of the brochure.
 */
export function PaperOrder() {
  const { rule, title } = paperCopy.order;

  return (
    <section className="relative py-14 xl:py-20">
      <div className="shell flex flex-col gap-8">
        <Rule>{rule}</Rule>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <h2
            className="m-0 font-daltown text-[clamp(26px,4.28vw,65px)] uppercase leading-[0.88] text-[#16161a]"
            data-reveal="clip"
          >
            {title}
          </h2>

          <ol className="m-0 flex list-none flex-col p-0">
            {ORDER.map((entry) => (
              <li
                key={entry.time}
                className="paper-rule flex flex-col gap-1 py-4 sm:flex-row sm:gap-10"
              >
                <span className="w-full shrink-0 font-[family-name:var(--font-display)] text-[14px] font-bold uppercase leading-6 tracking-[0.06em] text-[#16161a] sm:w-[110px]">
                  {entry.time}
                </span>
                <span className="font-[family-name:var(--font-ui)] text-[15px] leading-[1.7] text-[#16161a]/70">
                  {entry.body}
                </span>
              </li>
            ))}
            <li className="paper-rule" />
          </ol>
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-[1.7] text-[#16161a]/45">
          Hours follow {jazzablanca.name}&rsquo;s session time,{" "}
          {jazzablanca.sessionTime}.
        </p>
      </div>
    </section>
  );
}

/* The specification ------------------------------------------------- */

/**
 * What comes with each room, as a specification rather than a sales list:
 * the inclusions pooled across the packages and ticked off against them.
 *
 * It is the comparison table, set as print — which is the only form in which
 * a table belongs on a page this quiet. A package whose inclusions are not
 * written yet shows dashes, which is what the data honestly says.
 */
export function PaperSpecification() {
  const { rule, title } = paperCopy.included;

  const rows: string[] = [];
  for (const entry of hospitalityPackages) {
    for (const line of entry.included) {
      if (!rows.includes(line)) rows.push(line);
    }
  }

  const cell = "paper-rule px-3 py-3.5 align-top first:pl-0 last:pr-0";

  return (
    <section className="relative py-14 xl:py-20">
      <div className="shell flex flex-col gap-8">
        <Rule>{rule}</Rule>

        <h2
          className="m-0 max-w-[16ch] font-daltown text-[clamp(26px,4.28vw,65px)] uppercase leading-[0.88] text-[#16161a]"
          data-reveal="clip"
        >
          {title}
        </h2>

        <div className="-mx-[var(--shell-gutter)] overflow-x-auto px-[var(--shell-gutter)]">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <caption className="sr-only">
              What each SEVENPM hospitality space includes.
            </caption>
            <thead>
              <tr>
                <th scope="col" className={`${cell} w-[230px]`}>
                  <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[3px] text-[#16161a]/45">
                    Included
                  </span>
                </th>
                {hospitalityPackages.map((entry) => (
                  <th key={entry.slug} scope="col" className={cell}>
                    <span className="font-[family-name:var(--font-display)] text-[13px] font-bold uppercase leading-5 tracking-[0.04em] text-[#16161a]">
                      {entry.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((line) => (
                <tr key={line}>
                  <th scope="row" className={`${cell} font-normal`}>
                    <span className="font-[family-name:var(--font-ui)] text-[14px] leading-6 text-[#16161a]/70">
                      {line}
                    </span>
                  </th>
                  {hospitalityPackages.map((entry) => {
                    const has = entry.included.includes(line);
                    return (
                      <td key={entry.slug} className={cell}>
                        <span
                          role="img"
                          aria-label={has ? "Included" : "Not included"}
                          className={`font-[family-name:var(--font-display)] text-[14px] ${
                            has ? "text-[#16161a]" : "text-[#16161a]/25"
                          }`}
                        >
                          {has ? "✓" : "—"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-[1.7] text-[#16161a]/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}

/* The enquiry ------------------------------------------------------- */

/**
 * The one dark moment, at the foot: back to the festival.
 *
 * The page has been paper throughout, so ending on ink is the closing of a
 * brochure rather than a change of mind — and it lets the form keep the
 * site's own dark fields instead of needing a light variant.
 */
export function PaperEnquiry({ children }: { children: React.ReactNode }) {
  const { rule, title, body } = paperCopy.enquiry;
  const { email, phone } = hospitalityCopy.cta;

  return (
    <section id="enquiry" className="relative scroll-mt-24 bg-[#0b0b0e] py-16 xl:py-24">
      <div className="shell flex flex-col gap-10">
        <div className="flex items-baseline gap-4 border-t border-white/20 pt-4">
          <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[3px] text-brand">
            {rule}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <h2
              className="m-0 max-w-[12ch] font-daltown text-[clamp(28px,4.69vw,75px)] uppercase leading-[0.88] text-white"
              data-reveal="clip"
            >
              {title}
            </h2>
            <p className="m-0 max-w-[460px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.75] text-content-secondary">
              {body}
            </p>
            <p className="m-0 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-brand">
              {email}
            </p>
            <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-6 text-white/45">
              {phone}
            </p>
            <Link
              href="/contact"
              className="link-sweep self-start font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-6 tracking-[1.56px] text-white"
            >
              Or talk to the team
            </Link>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}
