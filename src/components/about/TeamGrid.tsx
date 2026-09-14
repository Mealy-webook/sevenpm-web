import Image from "next/image";

import type { TeamMember } from "@/data/about";

/** Portraits in luminosity, colour on hover, with role and company e-mail. */
export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <ul
      className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-10 p-0 sm:grid-cols-3 lg:grid-cols-4"
      data-reveal="up"
      data-reveal-stagger
    >
      {members.map((member) => (
        <li key={member.name} className="team-card group flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden bg-ink-700">
            <Image
              src={member.photo}
              alt={member.name}
              fill
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
              className="team-photo object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="m-0 font-[family-name:var(--font-display)] text-[17px] font-bold uppercase leading-6 tracking-[-0.02em] text-white">
              {member.name}
            </p>
            <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
              {member.role}
            </p>
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="link-sweep mt-1 self-start font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary transition-colors hover:text-brand"
              >
                {member.email}
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
