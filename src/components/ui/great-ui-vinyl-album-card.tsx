"use client";

import Image from "next/image";
import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Vinyl album card — 21st.dev "Great UI Vinyl Album Card" by Saurabh Sharma
 * (MIT), adapted for this site.
 *
 * A square cover with a record behind it. On hover the record slides out to
 * the right and turns half a revolution while the cover tips the other way,
 * and the caption fades up underneath.
 *
 * Four changes from the source:
 *
 * - The cover is square-cornered. The house rule is that only literally
 *   round things keep a radius, which is why the record still has one.
 * - The record is always the dark pressing. The source watches the document
 *   for a `dark` class and shows a white disc with a rainbow sheen
 *   otherwise; this site has one theme and it is dark.
 * - `next/image` rather than `<img>`, so the artwork goes through the site's
 *   AVIF and quality settings.
 * - `active` can drive it from outside, so a row of these can have one
 *   caption open at a time rather than each card minding itself.
 *
 * Built with React, TypeScript, Tailwind CSS and Framer Motion.
 * Source: https://21st.dev/@saurabh-2607/components/great-ui-vinyl-album-card
 * Author: Saurabh Sharma — https://x.com/srbh_s. MIT.
 */

export interface VinylAlbumCardProps {
  title?: string;
  /** The line under the title — an artist, a date, whatever the row is for. */
  meta?: string;
  coverImage: string;
  /** Edge of the square cover, in px. */
  size?: number;
  /** Controlled hover. Leave unset and the card minds its own. */
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
  /** Reserve the caption's height even while it is hidden. */
  captionHeight?: number;
  className?: string;
  sizes?: string;
}

/** The grooves, drawn as concentric rings the way the source does. */
const RINGS = [1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28];

export default function VinylAlbumCard({
  title,
  meta,
  coverImage,
  size = 288,
  active,
  onActiveChange,
  captionHeight = 64,
  className,
  sizes,
}: VinylAlbumCardProps) {
  const [ownHover, setOwnHover] = React.useState(false);
  const isHovered = active ?? ownHover;

  const setHover = (value: boolean) => {
    setOwnHover(value);
    onActiveChange?.(value);
  };

  /* The source slides the record 140 out of a 288 cover; kept as a ratio so
     it stays right at any size. */
  const slide = size * 0.486;
  const label = size * 0.333;

  return (
    <div
      className={cn("group relative flex select-none flex-col", className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* The record */}
        <motion.div
          aria-hidden
          className="absolute flex items-center justify-center overflow-hidden rounded-full border border-neutral-800 bg-[#0c0c0c]"
          style={{ width: size, height: size }}
          initial={{ x: 0, rotate: 0 }}
          animate={{ x: isHovered ? slide : 0, rotate: isHovered ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, mass: 1 }}
        >
          {RINGS.map((inset, index) => (
            <span
              key={inset}
              className={cn(
                "absolute rounded-full border",
                index % 2 ? "border-white/[0.05]" : "border-white/[0.09]",
              )}
              style={{ inset: inset * (size / 288) * 4 }}
            />
          ))}

          {/* The label, and the spindle hole through it. */}
          <span
            className="relative flex items-center justify-center overflow-hidden rounded-full bg-white"
            style={{ width: label, height: label }}
          >
            <Image
              src={coverImage}
              alt=""
              fill
              sizes={`${Math.round(label)}px`}
              className="scale-[1.05] object-cover"
            />
            <span className="relative z-10 block size-3 rounded-full bg-[#0f0f0f] shadow-inner ring-1 ring-black/50" />
            <span className="absolute inset-0 rounded-full ring-2 ring-inset ring-black/20" />
          </span>

          <span className="pointer-events-none absolute inset-0 rotate-45 bg-gradient-to-tr from-transparent via-white/10 to-transparent mix-blend-overlay" />
          <span className="pointer-events-none absolute inset-0 -rotate-45 bg-gradient-to-br from-transparent via-white/5 to-transparent mix-blend-overlay" />
        </motion.div>

        {/* The sleeve */}
        <motion.div
          className="absolute z-20 overflow-hidden bg-[#27272a]"
          style={{ width: size, height: size }}
          initial={{ rotate: 0, scale: 1, x: 0 }}
          animate={{
            rotate: isHovered ? -4 : 0,
            scale: isHovered ? 0.98 : 1,
            x: isHovered ? -size * 0.069 : 0,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          <Image
            src={coverImage}
            alt=""
            fill
            sizes={sizes ?? `${Math.round(size)}px`}
            className="scale-[1.05] object-cover"
          />
        </motion.div>
      </div>

      {title && (
        <motion.div
          className="z-20 mt-6 flex flex-col gap-1"
          style={{ width: size, height: captionHeight }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white">
            {title}
          </h3>
          {meta && (
            <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
              {meta}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
