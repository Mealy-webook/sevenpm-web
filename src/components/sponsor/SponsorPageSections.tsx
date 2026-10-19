import Image from "next/image";

import { ScrollRail } from "@/components/event/ScrollRail";
import { sponsorCopy } from "@/data/sponsor";
import { SponsorCtaButton } from "./SponsorDialog";

/**
 * `/sponsor`, from Figma 2640:6784: the pitch, the logo row, the audience
 * and the case studies, each on the 80/120 section padding, all on black.
 *
 * The comp's one call to action, "Get the partnership deck", opens the
 * enquiry pop-up (`SponsorDialog`) rather than a form on the page.
 */
const c = sponsorCopy;

/** Hero, 2640:6813: Daltown 230 headline, the intro in Title Section caps,
    and the yellow 60px button 48 below. */
export function SponsorPitch() {
  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell flex flex-col items-start gap-12">
        <div className="flex flex-col gap-2">
          <h1 className="display-text display-text--sponsor" data-reveal="clip">
            Put your brand
            <br />
            on stage.
          </h1>
          <p
            className="m-0 max-w-[756px] font-[family-name:var(--font-display)] text-title-section font-bold uppercase text-white"
            data-reveal="up"
          >
            {c.intro}
          </p>
        </div>
        <SponsorCtaButton className="sweep flex h-[60px] items-center justify-center bg-brand px-5 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e]">
          <span className="relative z-10">{c.form.submit}</span>
        </SponsorCtaButton>
      </div>
    </section>
  );
}

/** "Brands trust us", 2641:9034: one full-bleed row of square cells divided
    by hairlines — drawn as a 1px gap over a lit ground, as on the event
    page's wall, so no edge needs its border suppressed. */
export function SponsorLogos() {
  return (
    <section className="relative py-16 xl:py-20">
      <div className="flex flex-col gap-12">
        <h2 className="shell section-title w-full text-white" data-reveal="clip">
          Brands trust us
        </h2>
        <ul className="m-0 grid list-none grid-cols-3 gap-px border-y border-white/5 bg-white/5 p-0 lg:grid-cols-6" data-reveal="up">
          {c.trustedBy.logos.map((brand, index) => (
            <li key={index} className="flex aspect-square items-center justify-center bg-bg-primary p-4">
              <Image
                src={brand.logo}
                /* Named once: the comp repeats adidas to fill the row. */
                alt={c.trustedBy.logos.findIndex((b) => b.name === brand.name) === index ? brand.name : ""}
                width={250}
                height={50}
                className="h-auto max-h-[50px] w-full max-w-[250px] object-contain"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "Our audience", 2641:9583: four secondary-ground cards, 32 apart, each a
    Body-Default label, a card-title figure and a Body-Default note. */
export function SponsorAudienceRow() {
  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-12">
        <h2 className="section-title text-white" data-reveal="clip">
          Our audience
        </h2>
        <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 xl:grid-cols-4" data-reveal="up">
          {c.audience.cards.map((card) => (
            <li key={card.label} className="flex flex-col gap-4 bg-bg-secondary p-8">
              <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">
                {card.label}
              </span>
              <span className="card-title whitespace-nowrap text-white">{card.value}</span>
              <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">
                {card.note}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Case studies, 2641:9735: the title and intro on the left, and on the
    right a rail of 403-wide cards running off the screen edge. On desktop
    the page's scroll slides the rail; on a phone it is swiped. */
export function SponsorCaseRail() {
  return (
    <section id="case-studies" className="relative scroll-mt-24 overflow-hidden py-16 xl:py-20">
      <div className="shell flex flex-col gap-12 lg:flex-row lg:items-start">
        <div className="flex shrink-0 flex-col gap-4 lg:w-min">
          <h2 className="section-title text-white lg:whitespace-nowrap" data-reveal="clip">
            What our partners
            <br />
            experienced with us
          </h2>
          <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
            {c.caseStudies.intro}
          </p>
        </div>

        <ScrollRail className="-mr-[var(--shell-gutter)] min-w-0 flex-1 overflow-x-auto pb-2 pr-[var(--shell-gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="m-0 flex list-none gap-8 p-0">
            {c.caseStudies.items.map((k) => (
              <li key={k.brand} className="w-[78vw] shrink-0 sm:w-[360px] xl:w-[403px]">
                <article className="flex h-full flex-col border border-white/5 bg-bg-tertiary">
                  <div className="relative aspect-[403/268.667] w-full shrink-0 overflow-hidden bg-bg-secondary">
                    <Image
                      src={k.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 403px, (min-width: 640px) 360px, 78vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-6">
                    <h3 className="card-title text-white">{k.brand}</h3>
                    <p className="m-0 font-[family-name:var(--font-ui)] text-caption font-bold uppercase tracking-[0.12px] text-content-secondary">
                      The experience: {k.experience}
                    </p>
                    {k.todo ? (
                      <p className="m-0 mt-2 font-[family-name:var(--font-ui)] text-caption font-bold uppercase tracking-[0.12px] text-content-secondary">
                        {k.todo}
                      </p>
                    ) : null}
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
