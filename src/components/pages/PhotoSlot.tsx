import Image from "next/image";

/**
 * A photograph on a page whose own shoot has not happened yet.
 *
 * Given `src`, it renders that picture — a stand-in from the existing
 * festival library — and keeps `caption` as the brief for the photograph that
 * should replace it, carried in the alt text and in the markup rather than
 * buried in a comment, so the substitutions stay countable.
 *
 * Without `src` it falls back to the hatched box the mockups themselves draw,
 * which is still the right thing where nothing in the library fits.
 */
export function PhotoSlot({
  caption,
  src,
  className = "",
  rounded = true,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  caption: string;
  src?: string;
  className?: string;
  rounded?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  const shape = `${rounded ? "" : "!rounded-none"} ${className}`;

  /* `next/image` with `fill` needs a positioned parent, and this provides
     one — but a caller that wants the picture as a backdrop passes its own
     `absolute inset-0`, and two position utilities on one element is a
     coin toss decided by CSS source order, not by the order they are
     written. Where the caller has positioned it, theirs stands; `absolute`
     satisfies `fill` just as well as `relative` does. */
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className);
  const base = positioned ? "" : "relative";

  if (src) {
    return (
      <div
        /* The brief travels with the picture. When the real shot lands, this
           attribute is the list of what it has to show. */
        data-photo-brief={caption}
        className={`photo-slot ${base} overflow-hidden bg-ink-900 ${shape}`}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={caption}
      className={`photo-slot grid place-items-center bg-ink-900 px-6 text-center ${shape}`}
    >
      <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/35">
        [{caption}]
      </span>
    </div>
  );
}
