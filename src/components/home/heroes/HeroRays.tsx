"use client";

import LightRays from "@/components/ui/LightRays";
import { HeroLead, HeroName } from "./HeroShell";

/**
 * E · Rays — React Bits' LightRays (ogl), tinted brand.
 *
 * Beams from above the frame, spreading down over the name and following
 * the cursor. It is the lighting truss the hero used to have, done as a
 * shader instead of as DOM: the same idea the brand already had, without
 * the dozen blurred elements the truss cost.
 *
 * Of the options here this is the one that needs least explaining — a
 * festival hero lit from the rig above it.
 */
export function HeroRays() {
  return (
    <section className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-bg-primary">
      <div aria-hidden className="absolute inset-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#fbeb1c"
          raysSpeed={0.9}
          lightSpread={0.85}
          rayLength={2.4}
          followMouse
          mouseInfluence={0.12}
          noiseAmount={0.06}
          distortion={0.04}
          saturation={0.9}
          fadeDistance={1.2}
        />
      </div>

      <div className="shell pointer-events-none relative z-10 flex flex-col items-center gap-5">
        <HeroName />
        <HeroLead />
      </div>
    </section>
  );
}
