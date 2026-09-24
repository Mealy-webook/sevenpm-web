import { homeCopy } from "@/data/home";

/**
 * What every hero option has in common: the name at display size and the
 * standfirst under it. Kept in one place so the options differ in their
 * ground and their behaviour rather than in their typography.
 */
export function HeroName({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "ink";
}) {
  return (
    <h1
      className={`display-text hero-headline m-0 w-full text-center ${
        tone === "ink" ? "!text-[#18181b]" : ""
      } ${className}`}
      data-no-split
    >
      {homeCopy.heroTitle}
    </h1>
  );
}

export function HeroLead({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "ink";
}) {
  return (
    <p
      className={`m-0 max-w-[786px] text-center font-[family-name:var(--font-display)] text-[18px] leading-[1.6] ${
        tone === "ink" ? "text-[#18181b]/70" : "text-content-secondary"
      } ${className}`}
    >
      {homeCopy.intro}
    </p>
  );
}
