import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { events } from "@/data/events";

/**
 * Placeholder home page. The homepage design hasn't been implemented yet —
 * this exists so the event details route has somewhere to hang off while the
 * rest of the site is built.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="shell flex min-h-[50vh] flex-col items-start gap-12 py-16 xl:py-24">
        <h1 className="display-heading">Events</h1>
        <ul className="flex flex-col gap-4">
          {events.map((event) => (
            <li key={event.slug}>
              <Link
                href={`/events/${event.slug}`}
                className="font-[family-name:var(--font-display)] text-[22px] font-bold leading-7 text-white underline decoration-brand decoration-2 underline-offset-8 transition-colors hover:text-brand"
              >
                {event.name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
