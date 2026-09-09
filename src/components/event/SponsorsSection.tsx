import Image from "next/image";

import type { EventDetails } from "@/data/events";

function SponsorLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center font-[family-name:var(--font-display)] text-2xl font-black uppercase leading-[46px] text-brand">
      {children}
    </p>
  );
}

function SponsorLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex h-[50px] w-[250px] items-center justify-center">
      <Image
        src={logo}
        alt={name}
        width={250}
        height={50}
        className="max-h-[50px] w-auto max-w-[250px] object-contain"
      />
    </div>
  );
}

export function SponsorsSection({ event }: { event: EventDetails }) {
  return (
    <section id="sponsors" className="relative py-16 xl:py-24">
      <div className="shell flex flex-col items-center gap-8" data-reveal="up" data-reveal-stagger>
        <SponsorLabel>Official sponsor</SponsorLabel>
        <SponsorLogo
          name={event.officialSponsor.name}
          logo={event.officialSponsor.logo}
        />

        <SponsorLabel>Gold sponsors</SponsorLabel>
        <div className="flex flex-wrap items-center justify-center">
          {event.goldSponsors.map((sponsor) => (
            <SponsorLogo
              key={sponsor.name}
              name={sponsor.name}
              logo={sponsor.logo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
