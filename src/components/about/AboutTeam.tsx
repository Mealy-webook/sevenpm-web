import type { TeamMember } from "@/data/about";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { TeamGrid } from "./TeamGrid";

/** The team block on the About page; `/team` shows the same grid on its own. */
export function AboutTeam({
  members,
  title,
  body,
}: {
  members: TeamMember[];
  title: string;
  body: string;
}) {
  return (
    <section id="team" className="relative bg-ink-900 py-16 xl:py-24">
      <div className="shell flex flex-col gap-12">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <DisplayHeading align="left" reveal="clip" className="lg:w-auto">
            {title}
          </DisplayHeading>
          <p
            className="m-0 max-w-[480px] font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary"
            data-reveal="up"
          >
            {body}
          </p>
        </div>

        <TeamGrid members={members} />
      </div>
    </section>
  );
}
