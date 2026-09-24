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
    note: "React Bits' FaultyTerminal tinted brand, the name over it, and the frame reveal below.",
  },
  {
    href: "/preview/hero-wall",
    label: "A · Poster wall",
    note: "The four festival posters full height, drifting at different rates, name knocked over them. Hovering a column brings that festival to colour.",
  },
  {
    href: "/preview/hero-spotlight",
    label: "B · Spotlight",
    note: "A dark stage and a lamp you carry: the crowd exists only inside a circle that follows the cursor, and the name fills solid where the light crosses it.",
  },
  {
    href: "/preview/hero-stub",
    label: "C · Stub",
    note: "The hero as one enormous ticket — brand stock, perforated edge, drawn barcode. The only option that is not dark.",
  },
  {
    href: "/preview/hero-rays",
    label: "E · Rays",
    note: "React Bits' LightRays (ogl) tinted brand — beams from above the frame, following the cursor. The lighting truss the hero used to have, as a shader instead of a dozen blurred elements.",
  },
  {
    href: "/preview/hero-grid",
    label: "F · Grid",
    note: "React Bits' GridMotion (GSAP) — four rails of posters and gallery frames sliding opposite ways behind the name, easing toward the pointer. The work rather than a texture.",
  },
  {
    href: "/preview/hero-deck",
    label: "D · Deck",
    note: "The record turning under a tonearm with the featured festival named as what is playing. Name beside it, so nothing needs a scrim.",
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
