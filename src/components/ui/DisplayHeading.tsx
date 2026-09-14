/**
 * The oversized section titles, set live in **Daltown** (loaded through
 * `next/font/local` in `app/layout.tsx`). Figma draws them at 260px on a
 * 208px line box; the FAQ title is 152/118. `.display-text` scales both with
 * `--display-scale` so the type keeps its proportions on small screens.
 */
export function DisplayHeading({
  children,
  size = "xl",
  align = "center",
  className = "",
  reveal,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  /** `xl` = 260/208 section title; `faq` = 152/118. */
  size?: "xl" | "faq";
  align?: "center" | "left";
  className?: string;
  /** Opt into a MotionProvider scroll reveal. */
  reveal?: "clip" | "up" | "scale";
  as?: "h1" | "h2" | "p";
}) {
  return (
    <Tag
      className={`display-text w-full ${size === "faq" ? "display-text--faq" : ""} ${
        align === "center" ? "text-center" : "text-left"
      } ${className}`}
      data-reveal={reveal}
    >
      {children}
    </Tag>
  );
}
