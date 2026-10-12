"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction J — the concierge.
 *
 * Three questions instead of a catalogue: which festival, how many guests,
 * how many nights. The answer is a package, with the runners-up underneath
 * so nothing is hidden.
 *
 * The argument for it: this is the conversation the hospitality team has on
 * every call, and a visitor who knows they have fourteen guests on one night
 * does not want to compare five options — they want to be told. It also
 * collects exactly the fields the quote form asks for, so a visitor who gets
 * here arrives at the form already answered.
 *
 * The matching is deliberately simple and legible rather than clever: filter
 * by festival, then score each package on how well its stated capacity fits
 * the party. Capacities are written as prose ("Up to 10 guests", "[Group
 * size]"), so the number is read out of the string where there is one and
 * the package is treated as unconstrained where there is not — which is
 * honest, because for those the capacity genuinely is not decided yet.
 */

/** The first number in a capacity string, where it has one. */
function capacityOf(text: string) {
  const found = text.match(/\d+/);
  return found ? Number(found[0]) : undefined;
}

const PARTY = [
  { label: "Up to 10", value: 10 },
  { label: "10 – 25", value: 25 },
  { label: "25 – 50", value: 50 },
  { label: "More than 50", value: 80 },
];

export function Concierge() {
  const { eyebrow, from, discover } = hospitalityCopy.packages;
  const [festival, setFestival] = useState("Jazzablanca");
  const [party, setParty] = useState(PARTY[0].value);
  const [nights, setNights] = useState(hospitalityCopy.quote.nights[0]);

  const ranked = useMemo(() => {
    const pool = hospitalityPackages.filter((e) => e.festival === festival);
    return [...pool].sort((a, b) => score(b) - score(a));

    function score(entry: (typeof hospitalityPackages)[number]) {
      let points = 0;
      const cap = capacityOf(entry.capacity);

      /* A stated capacity that fits the party is the strongest signal; one
         that cannot hold it is the strongest against. */
      if (cap === undefined) points += 1;
      else if (cap >= party) points += 3;
      else points -= 2;

      /* The ten-day pass is the answer to "every night" and the wrong answer
         to one. It is the only package whose unit is the festival rather
         than the evening, so this reads its unit rather than its slug. */
      const perFestival = entry.perUnit.includes("pass");
      if (perFestival && nights === "The full festival") points += 3;
      if (perFestival && nights === "One night") points -= 2;

      return points;
    }
  }, [festival, party, nights]);

  const best = ranked[0];
  const rest = ranked.slice(1);

  const choice =
    "border px-4 py-2.5 font-[family-name:var(--font-display)] text-[14px] leading-5 transition-colors";
  const on = "border-brand bg-brand font-semibold text-[#18181b]";
  const off = "border-white/20 text-white/80 hover:border-white/50";

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-9">
        <div className="flex flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand">
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            Tell us the night
          </DisplayHeading>
          <p className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.7] text-content-secondary">
            Three questions and we will tell you which package fits, rather
            than leaving you to compare five.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
            <legend className="mb-1 p-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 text-white">
              Which festival?
            </legend>
            <div className="flex flex-wrap gap-2">
              {["Jazzablanca", "Tanjazz"].map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={festival === name}
                  onClick={() => setFestival(name)}
                  className={`${choice} ${festival === name ? on : off}`}
                >
                  {name}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
            <legend className="mb-1 p-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 text-white">
              How many guests?
            </legend>
            <div className="flex flex-wrap gap-2">
              {PARTY.map((size) => (
                <button
                  key={size.label}
                  type="button"
                  aria-pressed={party === size.value}
                  onClick={() => setParty(size.value)}
                  className={`${choice} ${party === size.value ? on : off}`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
            <legend className="mb-1 p-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 text-white">
              How many nights?
            </legend>
            <div className="flex flex-wrap gap-2">
              {hospitalityCopy.quote.nights.map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={nights === name}
                  onClick={() => setNights(name)}
                  className={`${choice} ${nights === name ? on : off}`}
                >
                  {name}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* The answer. Announced, because it changes without the page
            moving and a visitor using a screen reader would otherwise never
            know the recommendation had changed. */}
        <div aria-live="polite" className="flex flex-col gap-6">
          {best ? (
            <article
              className="flex flex-col overflow-hidden border border-brand/60 bg-ink-900 lg:flex-row"
              style={{ borderRadius: "var(--radius)" }}
            >
              <PhotoSlot
                key={best.slug}
                caption={best.photo}
                src={best.image}
                rounded={false}
                sizes="(min-width: 1024px) 360px, 100vw"
                className="h-[200px] w-full shrink-0 lg:h-auto lg:w-[360px]"
              />
              <div className="flex flex-1 flex-col gap-4 p-6 xl:p-8">
                <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-brand">
                  Our recommendation
                </span>
                <h3 className="m-0 font-daltown text-[clamp(26px,4.25vw,51px)] uppercase leading-[0.9] text-white">
                  {best.name}
                </h3>
                <p className="m-0 max-w-[520px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.7] text-content-secondary">
                  {best.summary}
                </p>
                <div className="mt-auto flex flex-wrap items-end gap-6 border-t border-white/10 pt-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                      {from}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-[21px] font-black leading-7 text-brand">
                      {best.price}
                    </span>
                    <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                      {best.perUnit} · {best.capacity}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/hospitality/${best.slug}`}
                      className="sweep flex items-center bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-[#0b0b0e]"
                    >
                      <span className="relative z-10">{discover}</span>
                    </Link>
                    <Link
                      href="#quote"
                      className="btn-secondary flex items-center border border-white/25 px-5 py-3.5 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-white transition-colors hover:border-white/60"
                    >
                      Request a quote
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ) : null}

          {rest.length ? (
            <div className="flex flex-col gap-3">
              <p className="m-0 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-white/45">
                Also available
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {rest.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/hospitality/${entry.slug}`}
                    className="flex flex-col gap-1 border border-white/10 p-4 transition-colors hover:border-white/35"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    <span className="font-[family-name:var(--font-display)] text-[15px] font-bold leading-6 text-white">
                      {entry.name}
                    </span>
                    <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-content-secondary">
                      {from} {entry.price} · {entry.capacity}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-[1.6] text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
