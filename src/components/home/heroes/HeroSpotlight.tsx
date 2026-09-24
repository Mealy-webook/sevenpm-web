"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";

import { HeroLead, HeroName } from "./HeroShell";

/**
 * B · Spotlight.
 *
 * A dark stage with a crowd behind it, and a single lamp you carry: the
 * photograph exists only inside a soft circle that follows the cursor. The
 * name sits over it in outline and fills solid wherever the light crosses
 * it, so moving the pointer paints the word in.
 *
 * The mask is two custom properties written straight to the element rather
 * than React state — a pointer move is up to 120 events a second, and none
 * of them should cost a render.
 *
 * Without a pointer there is nothing to carry, so touch and reduced motion
 * get the photograph at a low, even brightness instead (`.hero-spot` in
 * globals).
 */
export function HeroSpotlight() {
  const root = useRef<HTMLElement>(null);

  const track = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--sy", `${event.clientY - rect.top}px`);
  }, []);

  return (
    <section
      ref={root}
      onPointerMove={track}
      className="hero-spot relative flex h-svh w-full items-center justify-center overflow-hidden bg-bg-primary"
    >
      <span aria-hidden className="hero-spot-photo absolute inset-0 block">
        <Image
          src="/assets/gallery-2.jpg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </span>

      <div className="shell pointer-events-none relative z-10 flex flex-col items-center gap-5">
        <span className="hero-spot-name block w-full">
          <HeroName />
        </span>
        <HeroLead />
      </div>
    </section>
  );
}
