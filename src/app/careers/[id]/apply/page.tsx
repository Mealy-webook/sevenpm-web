import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { applyCopy, careersCopy, getRole, jobRoles } from "@/data/careers";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return jobRoles.map((role) => ({ id: role.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const role = getRole(id);
  if (!role) return { title: "Apply — SEVENPM" };
  return {
    title: `Apply: ${role.title} — SEVENPM`,
    description: role.summary,
    robots: { index: false },
  };
}

/**
 * The application form for one role. No Figma comp — the job page's layout
 * with the form in place of the body copy, and the role it is for pinned
 * down the right so you can see what you are applying to while you type.
 */
export default async function ApplyPage({ params }: PageProps) {
  const { id } = await params;
  const role = getRole(id);
  if (!role) notFound();

  const copy = careersCopy.role;
  const facts = [
    { label: copy.team, value: role.team },
    { label: copy.location, value: role.location },
    { label: copy.type, value: role.type },
    { label: copy.starts, value: role.starts },
  ];

  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <header className="shell flex flex-col gap-8 pb-10 pt-6 xl:pt-12">
          <Link
            href={`/careers/${role.id}`}
            className="link-sweep self-start font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-secondary transition-colors hover:text-brand"
          >
            ← {role.title}
          </Link>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-secondary">
            <span>{role.team}</span>
            <span>{role.location}</span>
            <span className="text-brand">{role.type}</span>
          </div>

          <h1
            className="m-0 max-w-[1100px] font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-[48px] xl:text-[64px]"
            data-reveal="clip"
          >
            {applyCopy.title}: {role.title}
          </h1>

          <p
            className="m-0 max-w-[640px] font-[family-name:var(--font-display)] text-[17px] leading-7 tracking-[0.085px] text-content-secondary"
            data-split="lines"
          >
            {applyCopy.intro}
          </p>
        </header>

        <div className="shell flex flex-col gap-12 pb-16 lg:flex-row lg:items-start lg:gap-16 xl:pb-24">
          <div className="min-w-0 flex-1">
            <ApplicationForm role={role} />
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-28 lg:w-[340px]">
            <div
              className="flex flex-col gap-2 border border-white/5 bg-bg-secondary p-6"
              data-reveal="up"
            >
              <h2 className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary">
                {role.title}
              </h2>
              <p className="m-0 pb-2 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                {role.summary}
              </p>
              {facts.map((fact, index) => (
                <div
                  key={fact.label}
                  className={`flex items-center justify-between gap-4 py-3 ${
                    index < facts.length - 1
                      ? "border-b-[0.5px] border-white/10"
                      : ""
                  }`}
                >
                  <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                    {fact.label}
                  </span>
                  <span className="text-right font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                    {fact.value}
                  </span>
                </div>
              ))}
              <Link
                href={`/careers/${role.id}`}
                className="link-sweep mt-2 self-start font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-primary transition-colors hover:text-brand"
              >
                {careersCopy.viewRole}
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
