import Image from "next/image";

/**
 * A word in Daltown with a window cut through one of its letters and a
 * photograph set into the hole.
 *
 * The homepage hero does this to the O of MORE. Generalising it is what lets
 * the device run through a whole page instead of appearing once: HOSPITALITY
 * has an O, every package name has a letter worth knocking out, and each
 * window is a different picture.
 *
 * The geometry is the hero's, as ratios of the font size, so the hole keeps
 * its place in the word at every width. `at` is the index of the letter the
 * window replaces — the letter is removed, not covered, because the window
 * is wider than any glyph and covering one would leave it poking out.
 *
 * The gaps carry the hero's bearing correction: the comp's 4px sits between
 * inked edges, and live text adds invisible side bearings either side of the
 * hole, so the nominal gap is reduced by roughly what Daltown's bearings
 * measure. Without it the hole reads as a gap in the word rather than a
 * window through it.
 */
const PILL = {
  width: 455 / 260,
  height: 173 / 260,
  gapBefore: 4 / 260 - 0.0105,
  gapAfter: 4 / 260 - 0.002,
};

export function WordWindow({
  word,
  at,
  src,
  className = "",
  sizes = "(min-width: 1024px) 40vw, 70vw",
  priority = false,
}: {
  word: string;
  at: number;
  src: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const before = word.slice(0, at);
  const after = word.slice(at + 1);

  return (
    <span
      className={`flex flex-wrap items-center justify-center font-daltown uppercase leading-[0.86] ${className}`}
    >
      {before ? <span>{before}</span> : null}

      <span
        className="relative block shrink-0 overflow-hidden rounded-full bg-white"
        style={{
          width: `${PILL.width}em`,
          height: `${PILL.height}em`,
          marginInlineStart: `${PILL.gapBefore}em`,
          marginInlineEnd: `${PILL.gapAfter}em`,
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </span>

      {after ? <span>{after}</span> : null}
    </span>
  );
}
