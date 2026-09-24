"use client";

import GridMotion from "@/components/ui/GridMotion";
import { festivals, galleryImages } from "@/data/home";
import { HeroLead, HeroName } from "./HeroShell";

/**
 * F · Grid — React Bits' GridMotion (GSAP).
 *
 * Four rails of artwork sliding in alternating directions behind the name,
 * each one easing toward the pointer. Unlike the shader options this one is
 * made of the festival posters and the gallery photographs, so the hero is
 * the work rather than a texture over it.
 *
 * The component takes 28 items to fill its rails. There are four posters
 * and six gallery frames, so the list is cycled to length rather than
 * padded with blanks — a rail with holes in it reads as a loading state.
 */
const RAIL = Array.from({ length: 28 }, (_, index) => {
  const art = [
    ...festivals.map((festival) => festival.card).filter(Boolean),
    ...galleryImages,
  ] as string[];
  return art[index % art.length];
});

export function HeroGrid() {
  return (
    <section className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-bg-primary">
      <div aria-hidden className="absolute inset-0 opacity-70">
        <GridMotion items={RAIL} gradientColor="#0b0b0e" />
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(11,11,14,0.94),rgba(11,11,14,0.62)_62%,rgba(11,11,14,0.88))]"
      />

      <div className="shell pointer-events-none relative z-10 flex flex-col items-center gap-5">
        <HeroName />
        <HeroLead />
      </div>
    </section>
  );
}
