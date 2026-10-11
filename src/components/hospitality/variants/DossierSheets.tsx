"use client";

import Link from "next/link";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction D — the dossier.
 *
 * Each package is a printed sheet taped to the page, a degree or two off
 * square, with its specification set as a ruled docket down one side. The
 * device is the homepage newsletter's taped bill, which is the one piece of
 * physical-object language the site already owns; here it carries a brief
 * instead of a sign-up.
 *
 * Alternate sheets are brand yellow and ink, so the column reads as a stack
 * of papers rather than a run of panels. The tilt alternates with them.
 *
 * Deliberately the least photographic of the directions: the picture is a
 * small print pasted onto the sheet, so a missing shoot costs a corner of
 * the page rather than the page.
 */
export function DossierSheets() {
  const { eyebrow, title, from, discover } = hospitalityCopy.packages;

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand">
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
        </div>

        <div className="flex flex-col gap-12 xl:gap-16">
          {hospitalityPackages.map((entry, index) => {
            const yellow = index % 2 === 0;
            const tilt = yellow ? "rotate-[0.6deg]" : "-rotate-[0.7deg]";

            return (
              <article
                key={entry.slug}
                data-reveal="up"
                className={`relative mx-auto w-full max-w-[1000px] p-6 sm:p-9 xl:p-12 ${tilt} ${
                  yellow ? "bg-brand text-[#18181b]" : "bg-[#f2efe9] text-[#18181b]"
                }`}
                style={{ borderRadius: "var(--radius)" }}
              >
                {/* Tape, on opposite corners, so each sheet is held down
                    rather than parked. Inside the sheet so it tilts with it —
                    the newsletter block learned this the hard way. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-[4%] top-0 z-[2] block h-[22px] w-[104px] -translate-x-1/2 -translate-y-1/2 -rotate-[33.63deg] bg-[rgba(120,120,120,0.28)]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-[96%] top-full z-[2] block h-[22px] w-[104px] -translate-x-1/2 -translate-y-1/2 -rotate-[33.63deg] bg-[rgba(120,120,120,0.28)]"
                />

                <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,300px)] lg:gap-12">
                  <div className="flex flex-col gap-5">
                    <p className="m-0 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-[#18181b]/55">
                      {entry.festival} · Business package
                    </p>

                    <h3 className="m-0 font-daltown text-[clamp(32px,5.5vw,72px)] uppercase leading-[0.9]">
                      {entry.name}
                    </h3>

                    <p className="m-0 max-w-[560px] font-[family-name:var(--font-ui)] text-[16px] leading-[1.7] text-[#18181b]/75">
                      {entry.summary}
                    </p>

                    {/* The docket: the spec as a ruled list, the way a
                        printed brief would set it. */}
                    {/* A column gutter, not gap-0: without it the value in the left
                        column butts straight into the label in the right one
                        and reads as one run-on string. */}
                    <dl className="m-0 mt-2 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                      {entry.specs.map((spec) => (
                        <div
                          key={spec.label}
                          className="flex items-baseline justify-between gap-4 border-b border-[#18181b]/20 py-2.5"
                        >
                          <dt className="m-0 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[1.56px] text-[#18181b]/55">
                            {spec.label}
                          </dt>
                          <dd className="m-0 text-right font-[family-name:var(--font-display)] text-[15px] font-semibold leading-5">
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-2 flex flex-wrap items-end gap-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-[#18181b]/55">
                          {from}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[26px] font-black leading-8">
                          {entry.price}
                        </span>
                        <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-[#18181b]/55">
                          {entry.perUnit}
                        </span>
                      </div>
                      <Link
                        href={`/hospitality/${entry.slug}`}
                        className="flex items-center bg-[#0b0b0e] px-5 py-3.5 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 text-white transition-colors hover:bg-[#0b0b0e]/85"
                        style={{ borderRadius: "var(--radius)" }}
                      >
                        {discover}
                      </Link>
                    </div>
                  </div>

                  {/* The print, pasted on square against the tilted sheet. */}
                  <div className="bg-white p-2.5 shadow-[0_14px_36px_rgba(0,0,0,0.25)]">
                    <PhotoSlot
                      caption={entry.photo}
                      src={entry.image}
                      rounded={false}
                      sizes="(min-width: 1024px) 300px, 100vw"
                      className="aspect-[4/5] w-full"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.6] text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
