import { jazzablanca } from "@/data/events";
import { nightCopy } from "@/data/hospitality";

/**
 * The evening, as a running order.
 *
 * The page is a night and this is its spine: the hours down the left at
 * display size, what happens at each one beside them, and the festival's own
 * doors-to-last-call window as the frame. SEVENPM is named for the hour the
 * music starts, so the clock is the brand's device rather than a motif
 * borrowed for a page.
 *
 * The four steps of the booking process are folded into the same spine
 * instead of getting a section of their own — they are what happens before
 * seven o'clock, so they are the first hour.
 */

const ORDER = [
  {
    time: "Before",
    title: "The quote",
    body: "You tell us the night and the number. We come back with a quote built around it, with invoice details for companies. Nothing is paid online.",
  },
  {
    time: "19:00",
    title: "Doors",
    body: "Your guests arrive at their own entrance, away from the main gate, and are met by name. Cloakroom on the way in.",
  },
  {
    time: "20:00",
    title: "Settled",
    body: "Drinks poured, food out, the first act on. The site is filling up in front of you and none of it is your problem.",
  },
  {
    time: "22:00",
    title: "The headline",
    body: "The set everyone came for, watched from a space your party has had all evening.",
  },
  {
    time: "00:00",
    title: "Last call",
    body: "The site closes. Parking is held on site, so nobody is hunting for a car at midnight.",
  },
];

export function RunningOrder() {
  const { stamp, title } = nightCopy.night;

  return (
    <section className="relative border-t border-white/10 bg-ink-900 py-16 xl:py-24">
      <div className="shell flex flex-col gap-11">
        <div className="flex flex-col gap-5">
          <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-brand">
            {stamp}
          </span>
          <h2
            className="m-0 max-w-[14ch] font-daltown text-[clamp(34px,6.5vw,104px)] uppercase leading-[0.88] text-white"
            data-reveal="clip"
          >
            {title}
          </h2>
        </div>

        <ol className="m-0 flex list-none flex-col p-0">
          {ORDER.map((hour) => (
            <li
              key={hour.time}
              data-reveal="up"
              className="flex flex-col gap-3 border-t border-white/12 py-7 sm:flex-row sm:gap-12 xl:py-9"
            >
              {/* The hour, at display size: it is the thing the page is
                  counting. */}
              <span className="w-full shrink-0 font-daltown text-[clamp(26px,4vw,56px)] uppercase leading-[0.9] text-brand sm:w-[180px] xl:w-[240px]">
                {hour.time}
              </span>

              <div className="flex flex-col gap-2">
                <h3 className="m-0 font-[family-name:var(--font-display)] text-[20px] font-black uppercase leading-7 text-white sm:text-[24px]">
                  {hour.title}
                </h3>
                <p className="m-0 max-w-[560px] font-[family-name:var(--font-ui)] text-[16px] leading-[1.75] text-content-secondary">
                  {hour.body}
                </p>
              </div>
            </li>
          ))}
          <li className="border-t border-white/12" />
        </ol>

        {/* Read off the event rather than typed here, so the spine cannot
            drift from the festival it describes. */}
        <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.7] text-white/45">
          Hours follow {jazzablanca.name}&rsquo;s own session time,{" "}
          {jazzablanca.sessionTime}.
        </p>
      </div>
    </section>
  );
}
