"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { LineupAct } from "@/data/lineup";
import { lineup, runningOrder } from "@/data/lineup";

/**
 * The lineup, from Figma 2618:14234.
 *
 * Two columns on the 1272 frame with 32 between them. On the left (511):
 * the title, and the day chips 32 under it. On the right (729): the day's
 * acts down a time spine — each row a 77 rail carrying a 24 brand square,
 * the start time and a hairline running down to the next, beside a 652
 * card: the photo (198), the name, the set's times in brand yellow, the
 * bio, a hairline, and the listen and watch buttons.
 *
 * The left column holds still while the acts scroll past it, so the day
 * chips are always to hand on a six-act night. The acts stack as they go:
 * each pins a step below the last and the next slides up over it, and the
 * ones underneath step back, smaller and darker. Below `lg`, or with
 * reduced motion, it is a plain list. Neither behaviour changes the
 * layout the comp draws.
 *
 * Two departures from the comp, both deliberate:
 * - It draws Facebook, X and Instagram on each act. The brief for this
 *   section is a Spotify and a YouTube link per act, so those are what the
 *   three squares became — two of them, in the comp's button.
 * - Its chips read Mon 02 / Tue 03 / Tue 04 July. 2 July 2026 is a
 *   Thursday, so the weekdays come from the data instead.
 *
 * The bill itself is `data/lineup.ts`, which is provisional — the comp's
 * own placeholders ("Artist 01") are what it carries until the real one is
 * announced.
 */

/** "19:30" → "07:30 PM" — the comp sets the card's times on a 12-hour clock. */
function twelve(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 && h < 24 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Where the first act pins, under the header, and the step between acts. */
const STACK_TOP = 112;
const STACK_STEP = 18;

/** "Thu 02 Jul" → "Thu, 02 Jul", as the chips set it. */
function chipDate(label: string) {
  return label.replace(/^(\w{3}) /, "$1, ");
}

export function LineupSection() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);
  const list = useRef<HTMLOListElement>(null);

  /* Stacking: as each act slides up over the one before, the ones it
     covers step back — a little smaller, a little darker — by how far the
     cards above them have come. Progress is read from the list's own top
     and the cards' cached heights, never from a card's rect: once a card
     is stuck, its rect stops moving. Desktop with motion only; paused
     while the list is off screen. */
  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const media = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    const items = Array.from(
      ol.querySelectorAll<HTMLElement>(".lineup-stack-item"),
    );
    const faces = items.map((li) =>
      li.querySelector<HTMLElement>(".lineup-stack-face"),
    );
    let offsets: number[] = [];
    let heights: number[] = [];
    let raf = 0;

    const measure = () => {
      heights = items.map((li) => li.offsetHeight);
      const gap = parseFloat(getComputedStyle(ol).rowGap) || 0;
      offsets = heights.map((_, j) =>
        heights.slice(0, j).reduce((sum, h) => sum + h + gap, 0),
      );
    };

    const paint = () => {
      raf = 0;
      if (!media.matches) return;
      const top = ol.getBoundingClientRect().top;
      items.forEach((_, i) => {
        let depth = 0;
        for (let j = i + 1; j < items.length; j++) {
          const natural = top + offsets[j];
          const stick = STACK_TOP + j * STACK_STEP;
          depth += Math.min(
            1,
            Math.max(0, (stick + heights[j] - natural) / heights[j]),
          );
        }
        const face = faces[i];
        if (!face) return;
        face.style.transform = depth
          ? `scale(${1 - Math.min(depth, 4) * 0.035})`
          : "";
        face.style.filter = depth
          ? `brightness(${1 - Math.min(depth, 3) * 0.18})`
          : "";
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const reset = () => {
      faces.forEach((f) => {
        if (f) {
          f.style.transform = "";
          f.style.filter = "";
        }
      });
    };

    measure();
    paint();
    let attached = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !attached) {
        window.addEventListener("scroll", onScroll, { passive: true });
        attached = true;
        onScroll();
      } else if (!entry.isIntersecting && attached) {
        window.removeEventListener("scroll", onScroll);
        attached = false;
      }
    });
    io.observe(ol);
    const onResize = () => {
      measure();
      if (media.matches) onScroll();
      else reset();
    };
    window.addEventListener("resize", onResize);
    media.addEventListener("change", onResize);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      media.removeEventListener("change", onResize);
      cancelAnimationFrame(raf);
    };
  }, [day.id]);

  return (
    <section
      id="artists"
      aria-labelledby="lineup-title"
      className="relative py-16 xl:py-20"
    >
      <div className="shell flex flex-col gap-10 lg:flex-row lg:gap-8">
        {/* Title and days */}
        <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:w-[511px] lg:shrink-0 lg:self-start">
          <h2
            id="lineup-title"
            className="section-title text-white"
            data-reveal="clip"
          >
            Lineup
          </h2>
          <div role="tablist" aria-label="Day" className="flex flex-wrap gap-4">
            {lineup.map((d, i) => {
              const on = d.id === day.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setDayId(d.id)}
                  className={`border px-4 py-[11px] text-left text-content-primary transition-colors duration-200 ${on ? "border-content-primary bg-white/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}
                >
                  <span className="block font-[family-name:var(--font-display)] text-[12px] leading-[22px] tracking-[0.12px]">
                    Day {i + 1}
                  </span>
                  <span className="block font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.1875px]">
                    {chipDate(d.label)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The day, down the spine */}
        <ol
          key={day.id}
          ref={list}
          role="tabpanel"
          aria-label={day.label}
          className="m-0 flex min-w-0 flex-1 list-none flex-col gap-6 p-0 lg:max-w-[729px]"
        >
          {acts.map((act, i) => (
            <li
              key={act.id}
              /* The stack: each act pins a step below the one before, so the
                 edge of every card it covers still shows above it. */
              className="lineup-stack-item flex bg-bg-primary"
              style={
                {
                  "--stack-top": `${STACK_TOP + i * STACK_STEP}px`,
                } as React.CSSProperties
              }
            >
              <div className="lineup-stack-face deck-fade flex w-full origin-top">
                {/* The rail */}
                <div className="flex w-14 shrink-0 flex-col items-center gap-2 sm:w-[77px]">
                  <span
                    aria-hidden
                    className="block size-5 bg-brand sm:size-6"
                  />
                  <span className="font-[family-name:var(--font-display)] text-[16px] font-bold leading-6 tracking-[-0.09px] text-white sm:text-[18px]">
                    {act.start}
                  </span>
                  <span aria-hidden className="w-px flex-1 bg-white/10" />
                </div>

                <ActCard act={act} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ActCard({ act }: { act: LineupAct }) {
  return (
    <article className="flex min-w-0 flex-1 flex-col gap-6 border border-white/5 bg-bg-tertiary p-4 sm:flex-row sm:p-6">
      <span className="relative block aspect-square w-full shrink-0 overflow-hidden bg-ink-900 sm:w-[198px]">
        <Image
          src={act.photo}
          alt={`${act.name}, official photo`}
          fill
          sizes="(min-width: 640px) 198px, 100vw"
          /* The stand-in portraits are round crops on white; 1.42 keeps
             only the square inside the circle. Drop it with real photos. */
          className="scale-[1.42] object-cover"
        />
      </span>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="m-0 font-daltown text-[calc(56px*var(--display-scale))] uppercase leading-[calc(40px*var(--display-scale))] tracking-[0.02em] text-white">
            {act.name}
          </h3>
          <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-brand">
            {twelve(act.start)} - {twelve(act.end)}
            <span className="text-content-secondary"> · {act.stage}</span>
          </span>
        </div>
        <p className="m-0 font-[family-name:var(--font-display)] text-[14px] leading-[19px] tracking-[0.15px] text-content-secondary">
          {act.bio}
        </p>
        <span aria-hidden className="block h-px w-full bg-white/10" />
        <div className="flex gap-3">
          {[
            {
              label: "Spotify",
              href: act.spotify,
              icon: "/assets/ic-spotify-24.svg",
            },
            {
              label: "YouTube",
              href: act.youtube,
              icon: "/assets/ic-youtube-24.svg",
            },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${act.name} on ${l.label}`}
              className="flex size-[42px] items-center justify-center border border-white/10 bg-bg-secondary transition-colors duration-200 hover:border-white/30"
            >
              <Image
                src={l.icon}
                alt=""
                width={16}
                height={16}
                className="size-4"
              />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
