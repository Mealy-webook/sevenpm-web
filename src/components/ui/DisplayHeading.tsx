/**
 * The section title. One size across the site — see `.section-title` in
 * globals.css for why. Set live in **Daltown** (loaded through
 * `next/font/local` in `app/layout.tsx`). Figma draws them at 260px on a
 * 208px line box; the FAQ title is 152/118. `.display-text` scales both with
 * `--display-scale` so the type keeps its proportions on small screens.
 */
export function DisplayHeading({
  children,
  align = "center",
  className = "",
  reveal,
  animate = true,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  /**
   * Formerly chose between two display sizes. There is one now, so this is
   * accepted and ignored rather than removed — a dozen call sites still pass
   * it and none of them should change meaning.
   */
  size?: "xl" | "faq";
  align?: "center" | "left";
  className?: string;
  /** Opt into a MotionProvider scroll reveal. */
  reveal?: "clip" | "up" | "scale";
  /**
   * False leaves the characters alone. For headings that belong to a shell
   * rather than a page — replaying the split on every tab switch reads as a
   * stutter.
   */
  animate?: boolean;
  as?: "h1" | "h2" | "p";
}) {
  return (
    <Tag
      /* One size for every section title. `size` is kept so the call sites
         do not all have to change, but both values now resolve to the design
         system's single section heading — the site had two display sizes and
         sixty ad-hoc ones, and no two titles matched. */
      className={`section-title w-full text-white ${
        align === "center" ? "text-center" : "text-left"
      } ${className}`}
      data-reveal={reveal}
      data-no-split={animate ? undefined : ""}
    >
      {children}
    </Tag>
  );
}
