import Image from "next/image";

import { festivals, homeCopy, homeStoryFounded } from "@/data/home";

/**
 * C · Magazine cover.
 *
 * The hierarchy inverted: one photograph is the hero and the name is a mark
 * in the corner, not a headline. Cover lines run down the left edge the way
 * they do on a masthead, and the issue line sits at the foot.
 *
 * The only option here where the brand is small. On a page whose next
 * screen is a wall of Daltown, a first screen that is almost entirely
 * photograph is the strongest contrast available.
 */
export function HeroCover() {
  const lines = festivals
    .filter((festival) => festival.card)
    .map((festival) => `${festival.name} · ${festival.city}`);

  return (
    <section className="relative h-svh w-full overflow-hidden bg-bg-primary">
      <Image
        src="/assets/gallery-2.jpg"
        alt=""
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      {/* Just enough to hold the corners, not a blanket over the picture. */}
      <span
        aria-hidden
        className="absolute inset-0 block bg-[linear-gradient(to_right,rgba(11,11,14,0.75),rgba(11,11,14,0.15)_42%,transparent_70%),linear-gradient(to_top,rgba(11,11,14,0.7),transparent_38%)]"
      />

      <div className="relative flex h-full flex-col justify-between px-[var(--shell-gutter)] py-12">
        <div className="flex items-start justify-between gap-6">
          <h1
            className="display-s m-0 font-daltown uppercase text-white"
            data-no-split
          >
            {homeCopy.heroTitle}
          </h1>
          <span className="pt-1 text-right font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[2px] text-white/70">
            Est. {homeStoryFounded}
            <br />
            Casablanca
          </span>
        </div>

        {/* Cover lines. */}
        <ul className="m-0 flex max-w-[420px] list-none flex-col gap-2 p-0">
          {lines.map((line) => (
            <li
              key={line}
              className="font-[family-name:var(--font-display)] text-body font-bold uppercase tracking-[1.2px] text-white"
            >
              <span aria-hidden className="mr-3 text-brand">
                /
              </span>
              {line}
            </li>
          ))}
        </ul>

        <p className="m-0 max-w-[520px] font-[family-name:var(--font-display)] text-body text-white/75">
          {homeCopy.intro}
        </p>
      </div>
    </section>
  );
}
