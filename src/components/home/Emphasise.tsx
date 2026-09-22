import { Fragment } from "react";

/**
 * Floods the listed phrases with brand inside a sentence, leaving the rest
 * of the words alone. Case-insensitive, first match per phrase — enough for
 * a fixed statement, and it keeps the copy in `data/home.ts` as one string
 * rather than a pile of fragments.
 */
export function Emphasise({
  text,
  phrases,
  className = "text-brand",
}: {
  text: string;
  phrases: readonly string[];
  className?: string;
}) {
  /* Split on every phrase at once, keeping the separators. */
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);
  const wanted = new Set(phrases.map((p) => p.toLowerCase()));

  return (
    <>
      {parts.map((part, index) =>
        wanted.has(part.toLowerCase()) ? (
          <em key={`${part}-${index}`} className={`not-italic ${className}`}>
            {part}
          </em>
        ) : (
          <Fragment key={`t-${index}`}>{part}</Fragment>
        ),
      )}
    </>
  );
}
