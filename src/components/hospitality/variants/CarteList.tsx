import Link from "next/link";

import { DisplayHeading } from "@/components/ui/DisplayHeading";
import {
  hospitalityCopy,
  hospitalityExtras,
  hospitalityPackages,
} from "@/data/hospitality";

/**
 * Direction M — the carte.
 *
 * Hospitality set the way a restaurant sets its menu: one centred column,
 * the name and the price on one line joined by leaders, the description
 * beneath in a smaller face. Spaces first, then what can be added to them,
 * the way a menu runs courses then sides.
 *
 * The argument: this is a page about an evening of food, drink and a good
 * seat, and the menu is the form that language already belongs to. It is
 * also, of the thirteen directions, the only one with no picture anywhere —
 * which makes it the one that is finished today rather than when the shoot
 * is.
 *
 * Server-rendered: nothing here needs state, so nothing here ships
 * JavaScript.
 */

/** Name and price on one line, joined by a leader rule. */
function Line({
  name,
  price,
  note,
  href,
}: {
  name: string;
  price: string;
  note: string;
  href?: string;
}) {
  const body = (
    <>
      <span className="flex items-baseline gap-3">
        <span className="font-[family-name:var(--font-display)] text-title-body font-bold uppercase tracking-[0.02em] text-white sm:text-title-section">
          {name}
        </span>
        {/* The leader. A rule that fills whatever space is left between the
            name and the price — which is what makes it read as a menu
            rather than as a two-column table. */}
        <span
          aria-hidden
          className="mb-1.5 h-px flex-1 bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.35)_0_2px,transparent_2px_6px)]"
        />
        <span className="shrink-0 font-[family-name:var(--font-display)] text-body-l font-semibold text-brand">
          {price}
        </span>
      </span>
      <span className="mt-1 block max-w-[560px] font-[family-name:var(--font-ui)] text-body-s text-content-secondary">
        {note}
      </span>
    </>
  );

  return (
    <li className="py-5">
      {href ? (
        <Link href={href} className="group block">
          {body}
        </Link>
      ) : (
        <div>{body}</div>
      )}
    </li>
  );
}

export function CarteList() {
  const { eyebrow, from } = hospitalityCopy.packages;

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col items-center gap-10">
        <div className="flex w-full max-w-[760px] flex-col items-center gap-4 text-center">
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-brand">
            {eyebrow}
          </p>
          <DisplayHeading align="center" reveal="clip" size="faq">
            The carte
          </DisplayHeading>
        </div>

        <div className="flex w-full max-w-[760px] flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h3 className="m-0 border-b border-white/25 pb-3 text-center font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[3px] text-white/50">
              The spaces
            </h3>
            <ul className="m-0 flex list-none flex-col divide-y divide-white/10 p-0">
              {hospitalityPackages.map((entry) => (
                <Line
                  key={entry.slug}
                  name={entry.name}
                  price={`${from} ${entry.price}`}
                  note={`${entry.festival} · ${entry.capacity} · ${entry.perUnit}. ${entry.summary}`}
                  href={`/hospitality/${entry.slug}`}
                />
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="m-0 border-b border-white/25 pb-3 text-center font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[3px] text-white/50">
              To add
            </h3>
            <ul className="m-0 flex list-none flex-col divide-y divide-white/10 p-0">
              {hospitalityExtras.map((extra) => (
                <Line
                  key={extra.id}
                  name={extra.label}
                  price={extra.price}
                  note={extra.note}
                />
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-4 border-t border-white/25 pt-8 text-center">
            <p className="m-0 max-w-[480px] font-[family-name:var(--font-ui)] text-body-s text-white/45">
              {hospitalityCopy.priceNote}
            </p>
            <Link
              href="#quote"
              className="sweep flex items-center bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-body font-semibold text-[#0b0b0e]"
            >
              <span className="relative z-10">Request a quote</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
