import { nightCopy } from "@/data/hospitality";

/**
 * The case, made once and at size.
 *
 * Every rejected direction put three small cards here and moved on. This
 * section is the argument instead: one line at display size that says what
 * is wrong with the ordinary version of the evening, the answer underneath
 * it, and the three promises as ruled statements rather than panels.
 *
 * Brand yellow across the full bleed, because it is the one moment on the
 * page that is not a photograph and should not try to be.
 */
export function Manifesto() {
  const { stamp, lead, body, points } = nightCopy.manifesto;

  return (
    <section className="relative bg-brand py-16 text-[#18181b] xl:py-24">
      <div className="shell flex flex-col gap-10">
        <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-[#18181b]/55">
          {stamp}
        </span>

        <div className="flex flex-col gap-7">
          <h2
            className="m-0 max-w-[16ch] font-daltown text-[clamp(38px,7.5vw,118px)] uppercase leading-[0.86]"
            data-reveal="clip"
          >
            {lead}
          </h2>
          <p
            className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-[17px] leading-[1.75] text-[#18181b]/75 sm:text-[19px]"
            data-split="lines"
          >
            {body}
          </p>
        </div>

        <ol className="m-0 grid list-none grid-cols-1 gap-0 p-0 md:grid-cols-3 md:gap-10">
          {points.map((point, index) => (
            <li
              key={point.title}
              data-reveal="up"
              className="flex flex-col gap-2 border-t-2 border-[#18181b] py-5 md:py-6"
            >
              <span className="font-[family-name:var(--font-display)] text-[12px] font-bold leading-4 tabular-nums tracking-[3px] text-[#18181b]/55">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="m-0 font-[family-name:var(--font-display)] text-[21px] font-black uppercase leading-7 sm:text-[24px]">
                {point.title}
              </h3>
              <p className="m-0 font-[family-name:var(--font-ui)] text-[15px] leading-[1.7] text-[#18181b]/70">
                {point.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
