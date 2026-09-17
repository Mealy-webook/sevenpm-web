"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import type { ArtistGroup, EventDetails } from "@/data/events";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

/** The Figma row is 1938 wide (it deliberately bleeds past the 1512 frame). */
const ROW_WIDTH = 1938;
const ROW_HEIGHT = 406;

/**
 * One act. The portrait carries the name and stage time, which only appear on
 * hover or keyboard focus — the row is a wall of faces at rest, and labelling
 * every one of them would bury the photographs.
 */
function Circle({
  image,
  name,
  time,
  size,
}: {
  image: string;
  name: string;
  time?: string;
  size: number;
}) {
  const big = size > 300;
  return (
    <div
      tabIndex={0}
      className="artist-circle group relative shrink-0 overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand"
      style={{ width: size, height: size }}
    >
      <Image
        src={image}
        alt={name}
        width={size}
        height={size}
        sizes={`${size}px`}
        className="size-full object-cover"
      />
      <span
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end gap-1 bg-gradient-to-t from-black/85 via-black/35 to-transparent pb-[14%] text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <span
          className={`px-4 font-[family-name:var(--font-display)] font-bold uppercase leading-tight text-white ${
            big ? "text-[22px]" : "text-[14px]"
          }`}
        >
          {name}
        </span>
        {time && (
          <span
            className={`font-[family-name:var(--font-display)] font-semibold leading-tight tracking-[0.1em] text-brand ${
              big ? "text-[14px]" : "text-[11px]"
            }`}
          >
            {time}
          </span>
        )}
      </span>
    </div>
  );
}

function Group({ group, last }: { group: ArtistGroup; last: boolean }) {
  const spacing = last ? undefined : { marginRight: -20 };

  if (group.type === "solo") {
    return (
      <div className="shrink-0" style={spacing}>
        <Circle
          image={group.image}
          name={group.name}
          time={group.time}
          size={406}
        />
      </div>
    );
  }

  return (
    <div
      className="flex w-[400px] shrink-0 flex-wrap items-start"
      style={spacing}
    >
      {group.items.map((item, index) =>
        item ? (
          <Circle
            key={`${item.image}-${index}`}
            image={item.image}
            name={item.name}
            time={item.time}
            size={200}
          />
        ) : (
          <div key={`empty-${index}`} className="size-[200px] shrink-0" />
        ),
      )}
    </div>
  );
}

export function ArtistsSection({ event }: { event: EventDetails }) {
  const [activeDay, setActiveDay] = useState(event.artistDays[0].id);
  const stage = useRef<HTMLDivElement>(null);
  const day =
    event.artistDays.find((entry) => entry.id === activeDay) ??
    event.artistDays[0];

  /* The row drifts, and stops under the cursor.
   *
   * The composition is 1938 wide and bleeds past the frame, so it is laid out
   * twice and travelled by exactly one width — at which point the second copy
   * is standing where the first was and the loop is seamless.
   *
   * The translation goes on an inner track because `.artist-row` already
   * carries the responsive `scale()`, and GSAP writes the whole `transform`
   * property: animating x on that node would throw the scale away.
   */
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const track = el.querySelector<HTMLElement>("[data-artist-track]");
      if (!track) return;

      /* Travel the distance between the two copies, measured rather than
         assumed — that is the loop period by construction, whatever the
         groups inside happen to add up to. */
      const first = track.children[0] as HTMLElement | undefined;
      const second = track.children[1] as HTMLElement | undefined;
      const span =
        first && second ? second.offsetLeft - first.offsetLeft : ROW_WIDTH;

      const tween = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: -span,
          /* Held at a constant speed rather than a constant duration, so the
             row does not race when there are more acts on a day. */
          duration: span / 40,
          ease: "none",
          repeat: -1,
        },
      );

      /* Eased rather than cut, so the row settles under the cursor instead of
         stopping dead the instant it crosses an edge. */
      let hovered = false;
      let onScreen = true;
      const settle = () =>
        gsap.to(tween, {
          timeScale: hovered || !onScreen ? 0 : 1,
          duration: hovered ? 0.5 : 0.7,
        });
      const slow = () => {
        hovered = true;
        settle();
      };
      const go = () => {
        hovered = false;
        settle();
      };

      /* Off screen it stops entirely. Eighteen portraits across 3,100px is
         real compositing work to be doing for nobody, and this row is a long
         way above the sections below it. */
      const io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          if (onScreen) tween.play();
          settle();
          if (!onScreen) tween.pause();
        },
        { rootMargin: "200px 0px" },
      );
      io.observe(el);

      el.addEventListener("pointerenter", slow);
      el.addEventListener("pointerleave", go);
      /* Keyboard users land on a portrait without ever pointing at it. */
      el.addEventListener("focusin", slow);
      el.addEventListener("focusout", go);

      return () => {
        io.disconnect();
        el.removeEventListener("pointerenter", slow);
        el.removeEventListener("pointerleave", go);
        el.removeEventListener("focusin", slow);
        el.removeEventListener("focusout", go);
      };
    }, el);

    return () => ctx.revert();
    /* Re-armed when the day changes: the groups are different elements. */
  }, [day.id]);

  return (
    <section id="artists" className="section-screen relative overflow-hidden py-16 xl:py-24">
      <div className="shell flex flex-col items-center justify-center gap-12">
        <DisplayHeading reveal="clip">Line-up</DisplayHeading>

        <div
          className="flex flex-wrap items-start justify-center gap-6"
          data-reveal="up"
        >
          {event.artistDays.map((entry) => {
            const active = entry.id === day.id;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setActiveDay(entry.id)}
                aria-pressed={active}
                className={`flex items-center overflow-hidden border px-7 py-4 font-[family-name:var(--font-ui)] text-base font-semibold leading-none text-white transition-colors ${
                  active
                    ? "border-white"
                    : "border-white/10 hover:border-white/40"
                }`}
              >
                {entry.label}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={stage} className="stage-artists relative mt-12 w-full">
        <div
          className="artist-row absolute left-1/2 top-0 flex items-start"
          style={{
            width: ROW_WIDTH,
            height: ROW_HEIGHT,
            marginLeft: -ROW_WIDTH / 2,
            transform: "scale(var(--artists-scale))",
            transformOrigin: "top center",
          }}
        >
          {/* Laid out twice so the travel loops without a seam. The second
              pass is decorative — screen readers read the line-up once. */}
          <div data-artist-track className="flex items-start">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-start"
                /* The copies overlap each other by the same −20 every pair of
                   groups inside them does, so the seam is not the one junction
                   in the row that looks different. */
                style={copy > 0 ? { marginLeft: -20 } : undefined}
                aria-hidden={copy === 1}
              >
                {/* Never `last`: that flag drops the −20px overlap every
                    other junction has, and in a row that loops there is no
                    last group — the seam would sit 20px wider than the rest
                    and read as a gap. */}
                {day.groups.map((group, index) => (
                  <Group
                    key={`${day.id}-${copy}-${index}`}
                    group={group}
                    last={false}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
