"use client";

import Image from "next/image";

import type { LineupAct, LineupDay } from "@/data/lineup";

/**
 * What every lineup direction shares. Preview furniture —
 * `/preview/lineup` only, until a direction is chosen.
 */

export function LineupHead({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <h2 id={id} className="section-title text-white" data-reveal="clip">
        Lineup
      </h2>
      {children}
    </div>
  );
}

/** One day at a time. Square segmented tabs, brand fill on the open one. */
export function DayTabs({
  days,
  value,
  onChange,
}: {
  days: LineupDay[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="tablist" aria-label="Day" className="flex flex-wrap gap-2">
      {days.map((d, i) => {
        const on = d.id === value;
        return (
          <button
            key={d.id}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => onChange(d.id)}
            className={`flex flex-col items-start border px-4 py-2.5 text-left transition-colors duration-200 ${on ? "border-brand bg-brand text-[#0b0b0e]" : "border-white/15 text-text-primary hover:border-white/40"}`}
          >
            <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.12em] opacity-70">
              Day {i + 1}
            </span>
            <span className="font-[family-name:var(--font-display)] text-body font-semibold">
              {d.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** "Main stage · 22:00 – 23:30" */
export function StageTime({
  act,
  className = "",
}: {
  act: LineupAct;
  className?: string;
}) {
  return (
    <span
      className={`font-[family-name:var(--font-display)] text-body-s font-medium uppercase tracking-[0.08em] ${className}`}
    >
      {act.stage} · {act.start} – {act.end}
    </span>
  );
}

/** Listen and watch. Square buttons, the platform named beside its mark. */
export function ActLinks({
  act,
  compact = false,
}: {
  act: LineupAct;
  /** Icons only, for tight rows. The name stays as the accessible label. */
  compact?: boolean;
}) {
  const links = [
    { label: "Spotify", href: act.spotify, icon: "/assets/ic-spotify-24.svg" },
    { label: "YouTube", href: act.youtube, icon: "/assets/ic-youtube-24.svg" },
  ];
  return (
    <div className="flex gap-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${act.name} on ${l.label}`}
          className={`btn-secondary inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-body-s font-semibold text-text-primary ${compact ? "size-10 justify-center" : "h-10 px-3"}`}
        >
          <Image src={l.icon} alt="" width={18} height={18} className="size-[18px]" />
          {compact ? null : l.label}
        </a>
      ))}
    </div>
  );
}

/**
 * The act's photo, cropped to its box.
 *
 * The stand-in portraits are the lineup comp's circles — round crops on
 * white — so drawn into a square they show white corners. Scaling by 1.42
 * (√2) keeps only the square inscribed in the circle, which is clean in any
 * box from 1:1 to 2:1. Real press photos are rectangular: when the bill
 * comes in, `CIRCLE_SOURCES` goes to false and the photo fills normally.
 */
const CIRCLE_SOURCES = true;

export function ActPhoto({
  act,
  sizes,
  className = "",
}: {
  act: LineupAct;
  sizes: string;
  className?: string;
}) {
  return (
    <span className={`relative block overflow-hidden bg-ink-900 ${className}`}>
      <Image
        src={act.photo}
        alt={`${act.name}, official photo`}
        fill
        sizes={sizes}
        className={`object-cover ${CIRCLE_SOURCES ? "scale-[1.42]" : ""}`}
      />
    </span>
  );
}

export function HeadlinerTag() {
  return (
    <span className="w-fit bg-brand px-2 py-1 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[0.1em] text-[#0b0b0e]">
      Headliner
    </span>
  );
}
