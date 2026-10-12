import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LineupBand } from "@/components/event/LineupBand";
import { FaqSection } from "@/components/event/FaqSection";
import { GallerySection } from "@/components/event/GallerySection";
import { HeroSection } from "@/components/event/HeroSection";
import { HospitalitySection } from "@/components/event/HospitalitySection";
import { LocationSection } from "@/components/event/LocationSection";
import { SponsorCta } from "@/components/event/SponsorCta";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { TicketsMarquee } from "@/components/event/TicketsMarquee";
import { TicketsSection } from "@/components/event/TicketsSection";
import { events, getEvent } from "@/data/events";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "SEVENPM" };

  return {
    title: `${event.name} — SEVENPM`,
    description: event.intro,
  };
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <HeroSection event={event} />
        <TicketsMarquee />
        <TicketsSection event={event} />
        {/* 2549:17634 puts hospitality straight after the tickets: the
            visitor has just seen what a standing ticket costs, which is the
            moment a box is worth mentioning. */}
        <HospitalitySection />
        <LineupBand />
        {/* The comp's order from here (2542:13992): what you need to know,
            the questions, the gallery, the partners, then the sign-up. The
            gallery used to sit above the practicalities; a visitor deciding
            whether to go wants the parking and the age limit before the
            photographs. */}
        <LocationSection event={event} />
        <FaqSection event={event} />
        <GallerySection event={event} />
        <SponsorsSection event={event} />
        {/* 2549:17616. The frame is named Subscribe and is not one — it is
            the sponsor pitch. The newsletter that was briefly here came out
            with it. */}
        <SponsorCta />
      </main>
      <SiteFooter />
    </>
  );
}
