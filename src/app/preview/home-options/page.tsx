import type { Metadata } from "next";

import styles from "./options.module.css";

export const metadata: Metadata = {
  title: "Homepage options — SEVENPM",
  robots: { index: false },
};

/**
 * Every homepage version on one page, live rather than as screenshots: each
 * one is the real route in a 1440-wide frame, scaled down to a thumbnail.
 *
 * Review chrome. It exists to make the choice, and goes with the options.
 *
 * The frames are inert — pointer events go to the card, so a click opens the
 * full version rather than scrolling a thumbnail. Each frame is loaded
 * lazily, so the six of them do not all start at once.
 */

const OPTIONS = [
  {
    href: "/",
    label: "Current",
    note: "The page as it is: lighting truss, image trail, festivals on a stage.",
  },
  {
    href: "/preview/home-stage",
    label: "A · Stage",
    note: "The event page's treatment. One idea per screen, hero untouched.",
  },
  {
    href: "/preview/home-editorial",
    label: "B · Editorial",
    note: "Numbered chapters with a rail down the side, hero untouched.",
  },
  {
    href: "/preview/home-poster",
    label: "C · Poster wall",
    note: "The whole page as printed matter. The hero is a pasted bill.",
  },
  {
    href: "/preview/home-broadcast",
    label: "D · Broadcast",
    note: "The whole page as a night's programme, every section on a timecode.",
  },
  {
    href: "/preview/home-artefacts",
    label: "E · Artefacts",
    note: "The whole page as objects. The hero is a ticket with a stub.",
  },
];

export default function HomeOptionsIndex() {
  return (
    <main className="min-h-svh bg-bg-primary">
      <div className="shell flex flex-col gap-10 py-14">
        <div className="flex flex-col gap-2">
          <h1 className="m-0 font-daltown text-[clamp(40px,6vw,88px)] uppercase leading-[0.9] text-white">
            Homepage options
          </h1>
          <p className="m-0 max-w-[640px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-secondary">
            Six live versions, each shown at the top of the page. Click one to
            open it full size; the switch at its bottom right moves between
            them. A and B keep the current hero, C, D and E replace it.
          </p>
          <p className="m-0 max-w-[640px] font-[family-name:var(--font-display)] text-[13px] leading-5 text-content-secondary">
            A thumbnail never scrolls, so anything that animates on scroll sits
            at its starting value — option A&rsquo;s counters read zero here and
            count up properly on the page itself.
          </p>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {OPTIONS.map((option, index) => (
            <li key={option.href} className="flex flex-col gap-3">
              <a
                href={option.href}
                className={`${styles.card} group border border-white/10 bg-bg-secondary transition-colors hover:border-brand`}
              >
                <iframe
                  src={option.href}
                  title={`${option.label} preview`}
                  loading={index < 3 ? "eager" : "lazy"}
                  tabIndex={-1}
                  aria-hidden
                  className={styles.frame}
                />
                <span className="absolute inset-0 bg-[#0b0b0e]/0 transition-colors group-hover:bg-[#0b0b0e]/20" />
              </a>

              <div className="flex flex-col gap-1">
                <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[1.5px] text-white">
                  {option.label}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 text-content-secondary">
                  {option.note}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
