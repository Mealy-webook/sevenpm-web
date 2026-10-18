import Image from "next/image";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { sponsorCopy } from "@/data/sponsor";

/**
 * Case studies. The mockup draws this as the page's one light band; the
 * page is all black by request, so the cases sit on the dark ground with
 * the rest, picked out by their photographs and the yellow tags instead.
 *
 * Each case now leads with a photograph — a festival picture standing in
 * for the partner's own until that shoot lands (the brief stays in
 * `photo`) — and the brand set in Daltown, so the three read as stories
 * rather than as forms. The heading takes the site's one section-title
 * size; it was the 260 display face and ran to four lines.
 */
export function SponsorCases() {
  const { eyebrow, title, intro, items, quote } = sponsorCopy.caseStudies;

  return (
    <section
      id="case-studies"
      className="relative scroll-mt-24 py-16 text-white xl:py-20"
    >
      <div className="shell flex flex-col gap-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-end">
          <div className="flex flex-col gap-4">
            <p
              className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-brand"
              data-reveal="up"
            >
              {eyebrow}
            </p>
            {/* Not `DisplayHeading`: that one is hard-coded white, and this
                section is the page's light band. */}
            <h2
              className="section-title max-w-[16ch] text-white"
              data-reveal="clip"
            >
              {title}
            </h2>
          </div>
          <p
            className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary"
            data-reveal="up"
          >
            {intro}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.brand}
              data-reveal="up"
              className="group flex flex-col overflow-hidden border border-white/10 bg-bg-secondary"
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden bg-[#18181b]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 410px, 100vw"
                  className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute bottom-0 left-0 bg-[#18181b] px-3 py-1.5 font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.1em] text-white/70">
                  Stand-in photo
                </span>
              </span>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex flex-wrap gap-2">
                  <span
                    className="bg-brand px-3 py-1 font-[family-name:var(--font-display)] text-caption font-bold text-[#0b0b0e]"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {item.kind}
                  </span>
                  <span
                    className="bg-white/10 px-3 py-1 font-[family-name:var(--font-display)] text-caption font-bold text-content-primary"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {item.festival}
                  </span>
                </div>

                <h3 className="card-title text-white">{item.brand}</h3>

                <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
                  <strong className="font-semibold text-white">
                    The experience:
                  </strong>{" "}
                  {item.experience}
                  {item.todo ? (
                    <>
                      {" "}
                      {/* The brief for this card, still to be written. Kept
                          visible and tinted, exactly as the mockup marks it. */}
                      <span className="text-brand/80">{item.todo}</span>
                    </>
                  ) : null}
                </p>

                <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
                  {item.metrics.map((metric) => (
                    <div
                      key={metric.note}
                      className="flex flex-col gap-0.5 bg-bg-tertiary p-4"
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      <p className="display-xs m-0 font-daltown text-brand">
                        {metric.value}
                      </p>
                      <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-content-secondary">
                        {metric.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* The partner quote, dark on the light band so it reads as a pull
            quote rather than a fourth card. */}
        <figure
          data-reveal="up"
          className="m-0 flex flex-col items-start gap-5 border-l-4 border-brand bg-bg-secondary p-8 sm:flex-row sm:items-center sm:gap-8 xl:p-10"
          style={{ borderRadius: "var(--radius)" }}
        >
          <PhotoSlot
            caption="Photo"
            className="size-[88px] shrink-0 !rounded-full"
          />
          <div className="flex flex-col gap-3">
            <blockquote className="m-0 font-[family-name:var(--font-display)] text-title-body font-bold text-brand sm:text-title-section">
              “{quote.text}”
            </blockquote>
            <figcaption className="font-[family-name:var(--font-ui)] text-body-s text-white/55">
              {quote.attribution}
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
