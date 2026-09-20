"use client";

/**
 * A number whose digits roll on wheels rather than being replaced.
 *
 * Each column is a 0–9 strip shifted by whole ems, so a digit going 4 → 6
 * travels through 5 the way a counter does. Columns are one `ch` wide under
 * `tabular-nums`, which is exactly one digit's advance, so nothing shifts
 * sideways while the wheels turn.
 *
 * The value is rendered in full for anyone not watching it move — screen
 * readers and a failed stylesheet both get the plain number.
 */

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function Odometer({
  value,
  /** Seconds. Later digits are held back a little so the roll cascades. */
  duration = 0.7,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const text = value.toLocaleString("en-US");
  const glyphs = text.split("");

  return (
    <span className={`inline-flex tabular-nums ${className}`} aria-hidden>
      {glyphs.map((glyph, index) => {
        const digit = Number(glyph);
        if (Number.isNaN(digit)) {
          /* Separators sit still — only the wheels turn. */
          return <span key={index}>{glyph}</span>;
        }
        return (
          <span
            key={index}
            className="relative inline-block h-[1em] w-[1ch] overflow-hidden align-baseline"
          >
            <span
              className="absolute inset-x-0 top-0 flex flex-col"
              style={{
                transform: `translateY(-${digit}em)`,
                transition: `transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1)`,
                /* Right to left: the units wheel leads and the hundreds
                   follow, which is the order they actually change in. */
                transitionDelay: `${(glyphs.length - 1 - index) * 0.06}s`,
              }}
            >
              {DIGITS.map((n) => (
                <span key={n} className="h-[1em] text-center leading-[1em]">
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
