"use client";

import Image from "next/image";
import * as React from "react";

/**
 * Hover-expand gallery — a row of closed rails, one of which opens under the
 * cursor. Dropped in from a component Ahmed supplied; three things are
 * different here and all three are house rules rather than taste:
 *
 * - **The colours are this project's tokens.** The original is written
 *   against shadcn's `bg-background` / `text-foreground` / `border-border`,
 *   none of which exist in this Tailwind v4 theme.
 * - **The panels are square.** The original rounds the open image 10px;
 *   square edges are the rule everywhere on this site.
 * - **Images go through `next/image`.** Everything else on the site does,
 *   and these are local assets that benefit from it.
 *
 * The API is otherwise the one that came in.
 */

export type HoverExpandItem = {
  /** The label. Rotated into the rail on desktop, a plain row on mobile. */
  title: string;
  /** Secondary label — a year, a role, a client. Only shown on the open panel. */
  meta?: string;
  /** Image URL. Panels without one fall back to `accent`. */
  src?: string;
  alt?: string;
  /** Any CSS background. Used when `src` is absent, and behind it while it decodes. */
  accent?: string;
};

export type HoverExpandGalleryProps = {
  items: HoverExpandItem[];
  /**
   * Height of the desktop row. Must be a definite length — everything below
   * the root is percentage-based, so `"100%"` collapses to 0px unless every
   * ancestor up to <html> has a real height too. Ignored below 1024px, where
   * the accordion sizes itself.
   */
  height?: string;
  /**
   * Width of a closed panel on desktop, in px — also the width of the label
   * rail. The open panel gets whatever is left, so keep
   * `items.length * railWidth` comfortably under the row's width.
   */
  railWidth?: number;
  /**
   * Cap on the open panel's width on desktop, in px. Keeps it a portrait
   * strip instead of a near-square block when there are few items; the row
   * centres inside whatever is left over.
   */
  maxOpenWidth?: number;
  /** Height of the open panel's image below 1024px, in px. */
  mobileImageHeight?: number;
  /** Which panel starts open. */
  defaultIndex?: number;
  /** Open/close duration, in ms. */
  duration?: number;
  onChange?: (index: number, item: HoverExpandItem) => void;
  /** Labels the row for assistive technology. */
  label?: string;
  className?: string;
};

export function HoverExpandGallery({
  items,
  height = "100svh",
  railWidth = 64,
  maxOpenWidth = 520,
  mobileImageHeight = 420,
  defaultIndex = 0,
  duration = 620,
  onChange,
  label,
  className = "",
}: HoverExpandGalleryProps) {
  const [active, setActive] = React.useState(defaultIndex);

  /* The open panel follows the data. Without this, switching to a day with
     fewer acts would leave an index pointing past the end and every panel
     closed. */
  const safeActive = Math.min(active, Math.max(0, items.length - 1));

  const open = (index: number) => {
    if (index === safeActive) return;
    setActive(index);
    onChange?.(index, items[index]);
  };

  const rootVars = {
    "--hx-h": height,
    "--hx-rail": `${railWidth}px`,
    "--hx-max": `${maxOpenWidth}px`,
    "--hx-t": `${duration}ms`,
  } as React.CSSProperties;

  return (
    <section
      style={rootVars}
      aria-label={label}
      className={`relative w-full bg-bg-primary text-content-primary lg:h-[var(--hx-h)] lg:overflow-hidden ${className}`}
    >
      <ul className="m-0 flex w-full list-none flex-col p-0 lg:h-full lg:flex-row lg:justify-center">
        {items.map((item, index) => {
          const isActive = index === safeActive;
          const panelVars = {
            // Desktop: flex-basis is what animates, rail width to open width.
            // Growing into the free space instead would need a max-width to
            // stay a portrait strip, and the clamp eats most of the travel —
            // the panel reaches its cap early and reads as a snap.
            // Mobile: the image block's height animates instead.
            "--hx-basis": isActive ? "var(--hx-max)" : "var(--hx-rail)",
            "--hx-img-h": isActive ? `${mobileImageHeight}px` : "0px",
            "--hx-img-o": isActive ? 1 : 0,
          } as React.CSSProperties;

          return (
            <li
              key={`${item.title}-${index}`}
              style={panelVars}
              className="border-b border-white/10 last:border-b-0 lg:h-full lg:min-w-0 lg:border-b-0 lg:border-l lg:last:border-r lg:[flex-basis:var(--hx-basis)] lg:[flex-grow:0] lg:[flex-shrink:1] lg:transition-[flex-basis] lg:duration-[var(--hx-t)] lg:ease-[cubic-bezier(0.32,0.72,0,1)] lg:motion-reduce:transition-none"
            >
              <button
                type="button"
                aria-current={isActive}
                aria-label={
                  item.meta ? `${item.title} — ${item.meta}` : item.title
                }
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") open(index);
                }}
                onFocus={() => open(index)}
                onClick={() => open(index)}
                className="group relative block w-full cursor-pointer border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand lg:h-full lg:overflow-hidden"
              >
                {/* Image. In flow below 1024px (its height animates); pinned to
                    the panel above it (the panel's width animates under it). */}
                <span
                  aria-hidden={!isActive}
                  style={{ background: item.accent, opacity: "var(--hx-img-o)" }}
                  className="relative block h-[var(--hx-img-h)] w-full overflow-hidden transition-[height,opacity] duration-[var(--hx-t)] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none lg:absolute lg:inset-y-2 lg:left-[var(--hx-rail)] lg:right-3 lg:h-auto lg:w-auto lg:transition-opacity"
                >
                  {item.src ? (
                    <Image
                      src={item.src}
                      alt={item.alt ?? ""}
                      fill
                      sizes="(min-width: 1024px) 520px, 100vw"
                      draggable={false}
                      className="object-cover"
                    />
                  ) : null}
                </span>

                {/* Label. A row below 1024px; above it a rail down the left of
                    the panel — title at the bottom, meta at the top. */}
                <span
                  className={`flex h-16 w-full items-center justify-between gap-3 overflow-hidden px-5 font-[family-name:var(--font-display)] text-[14px] font-semibold uppercase tracking-tight transition-colors duration-[var(--hx-t)] ease-out motion-reduce:transition-none lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-[var(--hx-rail)] lg:flex-col-reverse lg:justify-between lg:px-0 lg:py-5 ${
                    isActive ? "text-content-primary" : "text-content-secondary"
                  }`}
                >
                  <span className="truncate lg:overflow-hidden lg:rotate-180 lg:whitespace-nowrap lg:[writing-mode:vertical-rl]">
                    {item.title}
                  </span>
                  <span
                    style={{ opacity: isActive && item.meta ? 1 : 0 }}
                    className="shrink-0 text-[13px] font-semibold text-brand transition-opacity duration-[var(--hx-t)] ease-out motion-reduce:transition-none lg:rotate-180 lg:whitespace-nowrap lg:[writing-mode:vertical-rl]"
                  >
                    {item.meta}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default HoverExpandGallery;
