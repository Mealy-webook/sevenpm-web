import type { Metadata } from "next";

import styles from "./options.module.css";

export const metadata: Metadata = {
  title: "Hero options — SEVENPM",
  robots: { index: false },
};

/**
 * Every hero on one page, live rather than as screenshots: each is the real
 * route in a wide frame, scaled to a thumbnail. Click one to open it.
 *
 * Review chrome. It goes with the options once one is picked.
 */
const OPTIONS = [
  {
    href: "/",
    label: "Current · Terminal",
    note: "FaultyTerminal tinted brand, the name over it. Here for comparison.",
  },
  {
    href: "/preview/hero-split",
    label: "A · Editorial split",
    note: "Name ranged hard left, the programme as a ruled list under it, one poster running the full height of the right edge. Type and picture never overlap, so it needs no scrim and the poster keeps its colour.",
  },
  {
    href: "/preview/hero-lineup",
    label: "B · Line-up",
    note: "No picture and no centred name: the four festivals as four rows at display size, ruled like a bill. Hovering floods a row brand and brings its poster up. The hero is also the navigation.",
  },
  {
    href: "/preview/hero-cover",
    label: "C · Cover",
    note: "The hierarchy inverted — one photograph is the hero and the name is a mark in the corner, with cover lines down the edge. The only option where the brand is small.",
  },
  {
    href: "/preview/hero-board",
    label: "D · Board",
    note: "The hero as a schedule: festival, city, dates, status, ruled at display scale, each cell flicking over like a split-flap board. Information rather than an image.",
  },
];

export default function HeroOptionsIndex() {
  return (
    <main className="min-h-svh bg-bg-primary">
      <div className="shell flex flex-col gap-10 py-14">
        <div className="flex flex-col gap-2">
          <h1 className="m-0 font-daltown text-[clamp(40px,6vw,88px)] uppercase leading-[0.9] text-white">
            Hero options
          </h1>
          <p className="m-0 max-w-[640px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-secondary">
            Six alternatives to the terminal, and the current hero first. A to D
            are built here; E and F are React Bits components (LightRays and
            GridMotion), taken from their repo as the TypeScript + Tailwind
            variants and tinted brand. Each is the real route — click to open it
            full size. All of them keep the name and the standfirst; they differ
            in what is behind them and what the visitor can do with it.
          </p>
          <p className="m-0 max-w-[640px] font-[family-name:var(--font-display)] text-[13px] leading-5 text-content-secondary">
            A thumbnail never scrolls and has no pointer in it, so anything
            driven by either sits at its starting value here — B in particular
            needs opening, since the whole idea is carrying the lamp around.
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
                  title={option.label}
                  loading={index < 2 ? "eager" : "lazy"}
                  className={styles.frame}
                  tabIndex={-1}
                />
              </a>
              <div className="flex flex-col gap-1">
                <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[2px] text-brand">
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
