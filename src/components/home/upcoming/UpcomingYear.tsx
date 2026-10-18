import Image from "next/image";

import { Cta, SectionHead, bill } from "./shared";

/**
 * F · Year — where they fall.
 *
 * The year as a ruler, January to December, with each festival hung above
 * its own dates: the poster on a stem down to a brand bar the length of the
 * festival. Two names placed in a year say something a list of two cannot —
 * how far apart they are, and which comes first. Below `lg` the ruler is too
 * short to read and the two stack as plain cards.
 */
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function yearShare(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  const end = Date.UTC(d.getUTCFullYear() + 1, 0, 1);
  return (d.getTime() - start) / (end - start);
}

export function UpcomingYear() {
  const placed = bill
    .filter((f) => f.dates)
    .map((f) => {
      const a = yearShare(f.dates!.start);
      const b = yearShare(f.dates!.end) + 1 / 365;
      return { f, a, b, mid: (a + b) / 2 };
    });
  const year = bill[0]?.dates?.start.slice(0, 4);

  return (
    <section aria-labelledby="up-year" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <SectionHead id="up-year" />

        {/* Desktop: the ruler */}
        <div className="relative hidden lg:block" data-reveal="up">
          <ul className="relative m-0 h-[480px] list-none p-0">
            {placed.map(({ f, mid }) => (
              <li
                key={f.id}
                className="group absolute bottom-0 flex w-[228px] -translate-x-1/2 flex-col items-center"
                style={{ left: `${mid * 100}%` }}
              >
                <span className="relative block aspect-square w-full overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-out group-hover:-translate-y-2">
                  <Image
                    src={f.card as string}
                    alt={`${f.name} poster`}
                    fill
                    sizes="228px"
                    className="object-cover"
                  />
                </span>
                <div className="mt-4 flex w-full flex-col items-center gap-3 text-center">
                  <h3 className="card-title text-white">{f.name}</h3>
                  <Cta festival={f} />
                </div>
                {/* the stem */}
                <span aria-hidden className="mt-4 h-8 w-px bg-white/30" />
              </li>
            ))}
          </ul>

          <div className="relative border-t border-white/20">
            {placed.map(({ f, a, b }) => (
              <span
                key={f.id}
                aria-hidden
                className="absolute -top-[3px] h-[5px] bg-brand"
                style={{ left: `${a * 100}%`, width: `${(b - a) * 100}%` }}
              />
            ))}
            <ol className="m-0 grid list-none grid-cols-12 p-0">
              {MONTHS.map((m, i) => (
                <li
                  key={i}
                  className="border-l border-white/10 pt-3 pl-2 font-[family-name:var(--font-display)] text-[12px] uppercase tracking-[0.12em] text-text-secondary first:border-l-0"
                >
                  {m}
                </li>
              ))}
            </ol>
            {placed.map(({ f, mid }) => (
              <span
                key={f.id}
                className="absolute top-9 -translate-x-1/2 whitespace-nowrap font-[family-name:var(--font-display)] text-[13px] font-medium text-text-primary"
                style={{ left: `${mid * 100}%` }}
              >
                {f.when} · {f.city}
              </span>
            ))}
            <span className="absolute -top-12 right-0 font-daltown text-[32px] leading-none text-white/20">
              {year}
            </span>
          </div>
          <div className="h-12" />
        </div>

        {/* Below lg: plain cards */}
        <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:hidden">
          {bill.map((f) => (
            <li key={f.id} className="flex flex-col gap-4">
              <span className="relative block aspect-square w-full overflow-hidden">
                <Image
                  src={f.card as string}
                  alt={`${f.name} poster`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </span>
              <h3 className="card-title text-white">{f.name}</h3>
              <span className="font-[family-name:var(--font-display)] text-[14px] text-text-secondary">
                {[f.when, f.city].filter(Boolean).join(" · ")}
              </span>
              <Cta festival={f} className="w-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
