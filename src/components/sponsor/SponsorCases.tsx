import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { sponsorCopy } from "@/data/sponsor";

/**
 * Case studies. The one light section on the page, as the mockup draws it —
 * the argument changes from "what we offer" to "what we did", and the page
 * changes colour with it.
 */
export function SponsorCases() {
  const { eyebrow, title, intro, items, quote } = sponsorCopy.caseStudies;

  return (
    <section
      id="case-studies"
      className="relative scroll-mt-24 bg-[#f2efe9] py-14 text-[#18181b] xl:py-20"
    >
      <div className="shell flex flex-col gap-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-end">
          <div className="flex flex-col gap-4">
            <p
              className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-[#8a7a1f]"
              data-reveal="up"
            >
              {eyebrow}
            </p>
            {/* Not `DisplayHeading`: that one is hard-coded white, and this
                section is the page's light band. */}
            <h2
              className="display-text m-0 text-left !text-[#18181b]"
              data-reveal="clip"
            >
              {title}
            </h2>
          </div>
          <p
            className="m-0 font-[family-name:var(--font-ui)] text-[16px] leading-[1.7] text-[#56565d]"
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
              className="flex flex-col overflow-hidden bg-white"
              style={{ borderRadius: "var(--radius)" }}
            >
              <PhotoSlot
                caption={item.photo}
                rounded={false}
                className="min-h-[170px] w-full"
              />
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex flex-wrap gap-2">
                  <span
                    className="bg-[#18181b] px-3 py-1 font-[family-name:var(--font-display)] text-[12px] font-bold leading-5 text-brand"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {item.kind}
                  </span>
                  <span
                    className="bg-[#18181b]/8 px-3 py-1 font-[family-name:var(--font-display)] text-[12px] font-bold leading-5 text-[#18181b]"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {item.festival}
                  </span>
                </div>

                <h3 className="m-0 font-[family-name:var(--font-display)] text-[24px] font-black leading-[1.1] text-[#18181b]">
                  {item.brand}
                </h3>

                <p className="m-0 font-[family-name:var(--font-ui)] text-[15px] leading-[1.6] text-[#56565d]">
                  <strong className="font-semibold text-[#18181b]">
                    The experience:
                  </strong>{" "}
                  {item.experience}
                  {item.todo ? (
                    <>
                      {" "}
                      {/* The brief for this card, still to be written. Kept
                          visible and tinted, exactly as the mockup marks it. */}
                      <span className="text-[#8a7a1f]">{item.todo}</span>
                    </>
                  ) : null}
                </p>

                <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
                  {item.metrics.map((metric) => (
                    <div
                      key={metric.note}
                      className="flex flex-col gap-0.5 bg-[#f2efe9] p-4"
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      <p className="m-0 font-[family-name:var(--font-display)] text-[20px] font-black leading-6 text-[#8a7a1f]">
                        {metric.value}
                      </p>
                      <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-5 text-[#56565d]">
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
          className="m-0 flex flex-col items-start gap-5 bg-[#18181b] p-8 sm:flex-row sm:items-center sm:gap-8 xl:p-10"
          style={{ borderRadius: "var(--radius)" }}
        >
          <PhotoSlot
            caption="Photo"
            className="size-[88px] shrink-0 !rounded-full"
          />
          <div className="flex flex-col gap-3">
            <blockquote className="m-0 font-[family-name:var(--font-display)] text-[20px] font-bold leading-[1.35] text-brand sm:text-[24px]">
              “{quote.text}”
            </blockquote>
            <figcaption className="font-[family-name:var(--font-ui)] text-[14px] leading-5 text-white/55">
              {quote.attribution}
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
