/**
 * A photograph that has not been supplied yet.
 *
 * Both mockups are drawn with diagonally hatched boxes carrying a caption of
 * what belongs there — "[Photo: crowd in front of the main stage, Anfa Park]"
 * — and those captions are the brief. Reproducing the slot keeps the brief
 * visible on the page instead of burying it in a comment, and makes the gaps
 * countable when the shoot is commissioned.
 *
 * Swap for `next/image` as each photograph lands.
 */
export function PhotoSlot({
  caption,
  className = "",
  rounded = true,
}: {
  caption: string;
  className?: string;
  rounded?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={caption}
      className={`photo-slot grid place-items-center bg-ink-900 px-6 text-center ${
        rounded ? "" : "!rounded-none"
      } ${className}`}
    >
      <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/35">
        [{caption}]
      </span>
    </div>
  );
}
