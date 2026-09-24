import Image from "next/image";

import { festivals, festivalsRowOrder, homeCopy } from "@/data/home";

/**
 * A · Editorial split.
 *
 * The name is not in the middle of anything. It is ranged hard left at the
 * top of the page with the standfirst under it and the programme as a ruled
 * list beneath that, and a single poster runs the full height of the right
 * edge, bleeding off the top and bottom.
 *
 * It is the first hero here that needs no scrim, because the type and the
 * picture never overlap — which is also why the poster can stay in full
 * colour instead of being dimmed into a texture.
 */
export function HeroSplit() {
  const rows = festivalsRowOrder
    .map((id) => festivals.find((f) => f.id === id))
    .filter((f): f is (typeof festivals)[number] => Boolean(f));
  const cover = rows[0];

  return (
    <section className="relative grid h-svh w-full grid-cols-1 items-stretch overflow-hidden bg-bg-primary lg:grid-cols-[1fr_minmax(0,38%)]">
      <div className="flex min-w-0 flex-col justify-center gap-7 px-[var(--shell-gutter)] py-14">
        <h1
          className="m-0 font-daltown text-[clamp(56px,13vw,190px)] uppercase leading-[0.76] tracking-[0.01em] text-white"
          data-no-split
        >
          {homeCopy.heroTitle}
        </h1>

        <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-[17px] leading-7 tracking-[0.085px] text-content-secondary">
          {homeCopy.intro}
        </p>

        {/* The programme, as a ruled list rather than a paragraph. */}
        <dl className="m-0 mt-2 flex max-w-[560px] flex-col border-t border-white/12">
          {rows.map((festival) => (
            <div
              key={festival.id}
              className="flex items-baseline justify-between gap-4 border-b border-white/12 py-3"
            >
              <dt className="font-[family-name:var(--font-display)] text-[15px] font-bold uppercase leading-5 tracking-[0.5px] text-white">
                {festival.name}
              </dt>
              <dd className="m-0 shrink-0 font-[family-name:var(--font-display)] text-[13px] uppercase leading-5 tracking-[1.2px] text-content-secondary">
                {festival.when ?? festival.city}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* The picture, full height and flush to the edge. */}
      <div className="relative hidden lg:block">
        <Image
          src={cover.card ?? "/assets/gallery-2.jpg"}
          alt=""
          fill
          sizes="38vw"
          priority
          className="object-cover"
        />
      </div>
    </section>
  );
}
