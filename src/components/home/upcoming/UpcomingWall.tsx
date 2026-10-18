import Image from "next/image";

import { Cta, SectionHead, bill } from "./shared";

/**
 * D · Wall — pasted up.
 *
 * The two posters at full size on the wall, a few degrees off square and
 * pasted at different heights, each held by a strip of tape — the same tape
 * as the sponsor bill and the newsletter. The details hang under each one
 * as a printed label. Hovering one straightens it and brings it to the
 * front, the way you would pull a poster flat to read it.
 */
const PLACE = [
  { rotate: -4, shift: "", tape: -6 },
  { rotate: 3.5, shift: "lg:translate-y-[8%]", tape: 5 },
];

export function UpcomingWall() {
  return (
    <section
      aria-labelledby="up-wall"
      className="relative overflow-hidden py-16 xl:py-20"
    >
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <SectionHead id="up-wall" />

        <ul className="m-0 flex list-none flex-col items-center gap-16 p-0 pt-4 lg:flex-row lg:items-start lg:justify-center lg:gap-12 lg:pb-16">
          {bill.map((f, i) => {
            const p = PLACE[i % PLACE.length];
            return (
              <li
                key={f.id}
                data-reveal="up"
                className={`relative z-10 w-[min(500px,86vw)] shrink-0 hover:z-20 lg:w-[min(520px,38vw)] ${p.shift}`}
              >
                <div
                  className="group relative transition-transform duration-500 ease-out hover:!rotate-0 hover:scale-[1.02]"
                  style={{ rotate: `${p.rotate}deg` }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-0 z-10 block h-[28px] w-[132px] -translate-x-1/2 -translate-y-1/2 bg-[rgba(217,217,217,0.35)]"
                    style={{ rotate: `${p.tape}deg` }}
                  />
                  <span className="relative block aspect-square w-full overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
                    <Image
                      src={f.card as string}
                      alt={`${f.name} poster`}
                      fill
                      sizes="(min-width: 1024px) 520px, 86vw"
                      className="object-cover"
                    />
                  </span>

                  {/* The label */}
                  <div className="mt-4 flex flex-wrap items-end justify-between gap-4 bg-bg-secondary p-5">
                    <div className="flex flex-col gap-1">
                      <h3 className="card-title text-white">{f.name}</h3>
                      <span className="font-[family-name:var(--font-display)] text-[14px] leading-5 text-text-secondary">
                        {[f.when, f.city].filter(Boolean).join(" · ")}
                      </span>
                    </div>
                    <Cta festival={f} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
