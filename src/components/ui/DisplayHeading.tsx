import Image from "next/image";

/**
 * The oversized section titles are set in **Daltown**, a licensed display
 * face, so Figma can only hand them over as artwork. Each heading ships as a
 * transparent PNG sized to its Figma glyph box and sits inside a box the
 * height of the Figma line box, so the surrounding rhythm is unchanged.
 *
 * The `alt` text carries the real heading for assistive tech and search. If
 * the team licenses Daltown for web, swap the `<Image>` for the text and drop
 * `art` from the data — nothing else has to move.
 */

export type DisplayArt = {
  src: string;
  /** Natural size of the exported artwork. */
  width: number;
  height: number;
  /** Height of the Figma text box the artwork sat in. */
  lineBox: number;
};

export const DISPLAY_ART = {
  tickets: { src: "/assets/head-tickets.png", width: 401, height: 179, lineBox: 208 },
  location: { src: "/assets/head-location.png", width: 478, height: 178, lineBox: 208 },
  artists: { src: "/assets/head-artists.png", width: 411, height: 179, lineBox: 208 },
  gallery: { src: "/assets/head-gallery.png", width: 414, height: 178, lineBox: 208 },
  faq: { src: "/assets/head-faq.png", width: 606, height: 223, lineBox: 236 },
} satisfies Record<string, DisplayArt>;

export function DisplayHeading({
  art,
  children,
  align = "center",
  className = "",
  priority = false,
  reveal,
}: {
  art: DisplayArt;
  /** The heading text — used as the accessible name. */
  children: string;
  align?: "center" | "left";
  className?: string;
  priority?: boolean;
  /** Opt into a MotionProvider scroll reveal. */
  reveal?: "clip" | "up" | "scale";
}) {
  return (
    <h2
      className={`display-box w-full ${
        align === "center" ? "justify-center" : "justify-start"
      } ${className}`}
      data-reveal={reveal}
      style={
        {
          "--display-line-box": `${art.lineBox}px`,
          "--display-art-width": `${art.width}px`,
        } as React.CSSProperties
      }
    >
      <Image
        src={art.src}
        alt={children}
        width={art.width}
        height={art.height}
        priority={priority}
        unoptimized
        style={{ height: "auto" }}
      />
    </h2>
  );
}
