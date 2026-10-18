import Link from "next/link";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction R — the long read.
 *
 * Prose, with the packages set into it as pull-outs where the argument
 * reaches them. Not a catalogue with paragraphs around it: the writing
 * carries the page and each package appears at the moment it answers
 * something the reader has just been told.
 *
 * It is the only direction that argues rather than lists, which matters for
 * a reader who has not yet decided they want hospitality at all. It is also
 * the slowest to change, because the copy and the order are welded together
 * — a sixth package means rewriting a paragraph, not adding a card.
 *
 * Server-rendered: there is nothing here to interact with.
 */

/** The argument, in order, with the package each passage hands off to. */
const PASSAGES = [
  {
    body: "A festival is not an easy place to host anyone. The sound is where the stage is, the bar is where the queue is, and the seat — if there is one — is wherever you got to first. Hospitality exists because none of that is a good way to spend an evening with people whose time you have asked for.",
    hands: null,
  },
  {
    body: "The simplest answer is a room of your own above it all. A box faces the stage, holds your party for the night, and puts the food, the drinks and the parking on somebody else's list.",
    hands: "vip-box",
  },
  {
    body: "Not every evening wants a box. Some want air, and space to move between conversations — a garden behind the crowd, or a terrace looking down on it, where the music is the room's weather rather than its whole point.",
    hands: "garden-party-vip",
  },
  {
    body: "And some companies are not hosting an evening at all. They are hosting a festival: ten nights, different guests each time, one invoice and one contact for the lot of it.",
    hands: "corporate-pass",
  },
  {
    body: "Whichever it is, nothing is bought online. You tell us the night and the number, and we come back with a quote built around it — which is the only honest way to price a room that is yours for an evening.",
    hands: null,
  },
];

export function LongRead() {
  const { from, discover } = hospitalityCopy.packages;

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col items-center gap-10">
        <div className="flex w-full max-w-[720px] flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-brand">
            {hospitalityCopy.packages.eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            A better way to spend the evening
          </DisplayHeading>
        </div>

        <div className="flex w-full max-w-[720px] flex-col gap-9">
          {PASSAGES.map((passage, index) => {
            const entry = passage.hands
              ? hospitalityPackages.find((p) => p.slug === passage.hands)
              : undefined;

            return (
              <div key={index} className="flex flex-col gap-9">
                {/* The first paragraph carries the argument's weight, so it
                    is set larger than the rest. */}
                <p
                  className={`m-0 font-[family-name:var(--font-ui)] text-content-secondary ${
 index === 0
 ? "text-body-l text-white/90 sm:text-body-l"
 : "text-body-l "
 }`}
                >
                  {passage.body}
                </p>

                {entry ? (
                  /* The pull-out. Ruled off top and bottom so it reads as an
                     aside the prose steps around, not as a card dropped in. */
                  <aside
                    data-reveal="up"
                    className="flex flex-col gap-5 border-y border-white/15 py-7 sm:flex-row sm:items-center sm:gap-8"
                  >
                    <PhotoSlot
                      caption={entry.photo}
                      src={entry.image}
                      sizes="(min-width: 640px) 200px, 100vw"
                      className="aspect-[4/3] w-full shrink-0 sm:w-[200px]"
                    />

                    <div className="flex flex-1 flex-col gap-2">
                      <span className="font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[3px] text-brand">
                        {entry.festival} · {entry.capacity}
                      </span>
                      <h3 className="display-xs m-0 font-daltown uppercase text-white">
                        {entry.name}
                      </h3>
                      <span className="font-[family-name:var(--font-display)] text-body-l font-black text-brand">
                        {from} {entry.price}
                        <span className="ml-2 font-[family-name:var(--font-ui)] text-body-s font-normal text-white/45">
                          {entry.perUnit}
                        </span>
                      </span>
                      <Link
                        href={`/hospitality/${entry.slug}`}
                        className="link-sweep mt-1 self-start font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-white"
                      >
                        {discover}
                      </Link>
                    </div>
                  </aside>
                ) : null}
              </div>
            );
          })}

          {/* The packages the prose did not stop at, so nothing is hidden by
              the argument's shape. */}
          <div className="flex flex-col gap-3 border-t border-white/15 pt-7">
            <p className="m-0 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[3px] text-white/45">
              Also available
            </p>
            <ul className="m-0 flex list-none flex-col p-0">
              {hospitalityPackages
                .filter((p) => !PASSAGES.some((s) => s.hands === p.slug))
                .map((entry) => (
                  <li key={entry.slug} className="border-b border-white/10">
                    <Link
                      href={`/hospitality/${entry.slug}`}
                      className="flex items-baseline justify-between gap-4 py-3.5"
                    >
                      <span className="font-[family-name:var(--font-display)] text-body font-bold text-white">
                        {entry.name}
                      </span>
                      <span className="shrink-0 font-[family-name:var(--font-ui)] text-body-s text-content-secondary">
                        {from} {entry.price}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <p className="m-0 font-[family-name:var(--font-ui)] text-body-s text-white/45">
            {hospitalityCopy.priceNote}
          </p>
        </div>
      </div>
    </section>
  );
}
