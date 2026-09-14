import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ApplyButton } from "@/components/careers/ApplyButton";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { careersCopy, getRole, jobRoles } from "@/data/careers";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return jobRoles.map((role) => ({ id: role.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const role = getRole(id);
  if (!role) return { title: "Careers — SEVENPM" };
  return { title: `${role.title} — SEVENPM`, description: role.summary };
}

/**
 * One open role, from Figma 2231:10129: the title in Daltown over two
 * columns — responsibilities and desired profile on the left, the "at a
 * glance" card with the Apply button on the right.
 */
export default async function RolePage({ params }: PageProps) {
  const { id } = await params;
  const role = getRole(id);
  if (!role) notFound();

  const copy = careersCopy.role;
  const facts = [
    { label: copy.team, value: role.team },
    { label: copy.location, value: role.location },
    { label: copy.type, value: role.type },
    { label: copy.starts, value: role.starts },
    { label: copy.posted, value: role.postedLabel },
  ];

  const list = (title: string, items: string[]) => (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-[34px] tracking-[-0.13px] text-white sm:text-[28px]">
        {title}
      </h2>
      <ul
        className="m-0 flex list-none flex-col gap-2 p-0"
        data-reveal="up"
        data-reveal-stagger
      >
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary"
          >
            <span aria-hidden>·</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <div className="shell flex flex-col gap-12 pb-16 pt-6 xl:pt-12">
          <DisplayHeading as="h1" size="faq" align="left" reveal="clip">
            {role.title}
          </DisplayHeading>

          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-8">
            <div className="flex min-w-0 flex-1 flex-col gap-12">
              {list(copy.responsibilities, role.responsibilities)}
              {list(copy.profile, role.profile)}
            </div>

            <aside
              className="flex w-full shrink-0 flex-col gap-6 border border-white/5 bg-bg-secondary p-6 lg:sticky lg:top-28 lg:w-[403px]"
              data-reveal="up"
            >
              <h2 className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary">
                {copy.summary}
              </h2>

              <div className="flex flex-col">
                {facts.map((fact, index) => (
                  <div
                    key={fact.label}
                    className={`flex items-center justify-between gap-4 py-4 ${
                      index < facts.length - 1
                        ? "border-b-[0.5px] border-white/10"
                        : ""
                    }`}
                  >
                    <span className="font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
                      {fact.label}
                    </span>
                    <span className="text-right font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-white">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>

              <ApplyButton role={role} variant="block" />
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
