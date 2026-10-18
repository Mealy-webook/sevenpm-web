import Link from "next/link";

import type { Festival } from "@/data/home";
import { festivals, festivalsRowOrder, homeCopy } from "@/data/home";

/**
 * What every upcoming-events direction shares: the bill itself, the section
 * head and the way in. Preview furniture — `/preview/upcoming-events` only,
 * until a direction is chosen.
 */

/** The festivals on the bill, in order, with artwork. */
export const bill: Festival[] = festivalsRowOrder
  .map((id) => festivals.find((f) => f.id === id))
  .filter((f): f is Festival => Boolean(f?.card));

export const cities = [...new Set(bill.map((f) => f.city).filter(Boolean))];

export function SectionHead({ id }: { id: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <h2 id={id} className="section-title text-white" data-reveal="clip">
        {homeCopy.festivalsTitle}
      </h2>
      <p
        className="m-0 font-[family-name:var(--font-display)] text-body-s uppercase tracking-[0.12em] text-text-secondary"
        data-reveal="up"
      >
        {String(bill.length).padStart(2, "0")} festivals · {cities.join(" · ")}
      </p>
    </div>
  );
}

/**
 * "Get tickets" where there is an event page; "Tickets soon" where there is
 * not, rather than a link to `#`.
 */
export function Cta({
  festival,
  tone = "dark",
  className = "",
}: {
  festival: Festival;
  /** `light` on a paper ground, where the quiet state needs dark ink. */
  tone?: "dark" | "light";
  className?: string;
}) {
  if (festival.href !== "#") {
    return (
      <Link
        href={festival.href}
        className={`sweep inline-flex shrink-0 items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e] after:!bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
      >
        <span className="relative z-10">Get tickets</span>
      </Link>
    );
  }
  const quiet =
    tone === "light"
      ? "border-black/20 text-black/55"
      : "border-white/15 bg-white/5 text-text-secondary";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold ${quiet} ${className}`}
    >
      Tickets soon
    </span>
  );
}

/** "02 – 11 July 2026" → { days: "02–11", month: "Jul", year: "2026" }. */
export function splitWhen(when?: string) {
  const m = when?.match(/^(\d+)\s*[–-]\s*(\d+)\s+(\w+)\s+(\d{4})$/);
  if (!m) return null;
  return { days: `${m[1]}–${m[2]}`, month: m[3].slice(0, 3), year: m[4] };
}
