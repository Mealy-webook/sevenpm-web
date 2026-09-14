import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { bookingCopy } from "@/data/booking";
import { events, getEvent } from "@/data/events";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tier?: string }>;
};

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  return {
    title: event ? `Book ${event.name} — SEVENPM` : "Book — SEVENPM",
    robots: { index: false },
  };
}

/**
 * Checkout. No Figma comp — the account system's cards and rows on the left,
 * the "at a glance" card as the order summary on the right. No footer: the
 * page has one job.
 */
export default async function BookPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { tier } = await searchParams;
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main className="pb-16 xl:pb-24">
        <div className="shell flex flex-col gap-8 pt-6 xl:pt-12">
          <Link
            href={`/events/${event.slug}`}
            className="link-sweep self-start font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-secondary transition-colors hover:text-brand"
          >
            ← {bookingCopy.backToEvent}
          </Link>

          <DisplayHeading as="h1" size="faq" align="left" reveal="clip">
            {bookingCopy.title} {event.name}
          </DisplayHeading>

          <BookingFlow event={event} initialTier={tier} />
        </div>
      </main>
    </>
  );
}
