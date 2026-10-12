import { hospitalityCopy, nightCopy } from "@/data/hospitality";

/**
 * The questions, set as the back of an invitation rather than as an
 * accordion.
 *
 * Everything is open. There are four of them, the answers are two lines
 * each, and hiding four short answers behind four clicks is ceremony with
 * nothing behind it — the only thing a disclosure would save here is a
 * screen of scrolling nobody minded.
 *
 * Two columns on a wide screen, ruled, in the smaller face: it reads as
 * terms, which is what it is.
 */
export function SmallPrint() {
  const { stamp, title } = nightCopy.smallPrint;
  const { items } = hospitalityCopy.faq;

  return (
    <section className="relative py-16 xl:py-24">
      <div className="shell flex flex-col gap-11">
        <div className="flex flex-col gap-5">
          <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-brand">
            {stamp}
          </span>
          <h2
            className="m-0 font-daltown text-[clamp(30px,5.5vw,88px)] uppercase leading-[0.88] text-white"
            data-reveal="clip"
          >
            {title}
          </h2>
        </div>

        <dl className="m-0 grid grid-cols-1 gap-x-16 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.q}
              data-reveal="up"
              className="flex flex-col gap-2 border-t border-white/12 py-6"
            >
              <dt className="m-0 font-[family-name:var(--font-display)] text-[16px] font-bold uppercase leading-6 tracking-[0.02em] text-white">
                {item.q}
              </dt>
              <dd className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.75] text-content-secondary">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
