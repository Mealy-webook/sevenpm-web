import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
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
  return {
    title: `${role.title} — SEVENPM`,
    description: role.summary,
  };
}

/**
 * One open role. No Figma comp — the article page's shape (back link, meta
 * line, big headline, one measure of copy) with the account card as an
 * "at a glance" panel down the right, and the other roles underneath.
 */
export default async function RolePage({ params }: PageProps) {
  const { id } = await params;
  const role = getRole(id);
  if (!role) notFound();

  const copy = careersCopy.role;
  const others = jobRoles.filter((other) => other.id !== role.id).slice(0, 3);
  const mailto = `mailto:${careersCopy.email}?subject=${encodeURIComponent(
    `${role.title} — application`,
  )}`;

  const facts = [
    { label: copy.team, value: role.team },
    { label: copy.location, value: role.location },
    { label: copy.type, value: role.type },
    { label: copy.starts, value: role.starts },
    { label: copy.reportsTo, value: role.reportsTo },
    { label: copy.posted, value: role.postedLabel },
  ];

  const list = (title: string, items: string[]) => (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white">
        {title}
      </h2>
      <ul
        className="m-0 flex list-none flex-col gap-3 p-0"
        data-reveal="up"
        data-reveal-stagger
      >
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-4 font-[family-name:var(--font-display)] text-[17px] leading-7 tracking-[0.085px] text-content-secondary"
          >
            <span aria-hidden className="text-brand">
              —
            </span>
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
        <header className="shell flex flex-col gap-8 pb-10 pt-6 xl:pt-12">
          <Link
            href="/careers"
            className="link-sweep self-start font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-secondary transition-colors hover:text-brand"
          >
            ← {copy.back}
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
            {role.title}
          </h1>

          <p
            className="m-0 max-w-[760px] font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-8 tracking-[-0.11px] text-content-secondary"
            data-split="lines"
          >
            {role.summary}
          </p>
        </header>

        <div className="shell flex flex-col gap-12 pb-16 lg:flex-row lg:items-start lg:gap-16 xl:pb-24">
          {/* Body */}
          <div className="flex min-w-0 flex-1 flex-col gap-10">
            <section className="flex flex-col gap-4">
              <h2 className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white">
                {copy.about}
              </h2>
              {role.about.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="m-0 max-w-[760px] font-[family-name:var(--font-display)] text-[17px] leading-7 tracking-[0.085px] text-content-secondary"
                  data-reveal="up"
                >
                  {paragraph}
                </p>
              ))}
            </section>

            {list(copy.responsibilities, role.responsibilities)}
            {list(copy.requirements, role.requirements)}
            {role.niceToHave.length > 0 &&
              list(copy.niceToHave, role.niceToHave)}
          </div>

          {/* At a glance + apply */}
          <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-28 lg:w-[340px]">
            <div
              className="flex flex-col gap-2 border border-white/5 bg-bg-secondary p-6"
              data-reveal="up"
            >
              <h2 className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary">
                {copy.summary}
              </h2>
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
            </div>

            <div className="flex flex-col gap-4" data-reveal="up">
              <h2 className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-brand">
                {copy.applyTitle}
              </h2>
              <p className="m-0 font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
                {copy.applyBody}
              </p>
              <Link
                href={`/careers/${role.id}/apply`}
                data-magnetic="0.2"
                data-cursor="Apply"
                className="sweep flex items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#0b0b0e]"
              >
                <span className="relative z-10">{careersCopy.applyCta}</span>
              </Link>
              <a
                href={mailto}
                className="link-sweep self-start font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-secondary transition-colors hover:text-brand"
              >
                or e-mail {careersCopy.email}
              </a>
            </div>
          </aside>
        </div>

        {/* Other roles */}
        {others.length > 0 && (
          <section className="relative bg-ink-900 py-16 xl:py-24">
            <div className="shell flex flex-col gap-8">
              <h2 className="m-0 font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-content-primary">
                {copy.other}
              </h2>
              <ol
                className="m-0 flex list-none flex-col p-0"
                data-reveal="up"
                data-reveal-stagger
              >
                {others.map((other) => (
                  <li
                    key={other.id}
                    className="group border-b border-border-tertiary transition-colors hover:border-white/25"
                  >
                    <Link
                      href={`/careers/${other.id}`}
                      data-cursor="Open"
                      className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="font-[family-name:var(--font-display)] text-[22px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-white transition-colors group-hover:text-brand sm:text-[28px]">
                        {other.title}
                      </span>
                      <span className="flex flex-wrap items-center gap-x-6 gap-y-1 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-secondary">
                        <span>{other.team}</span>
                        <span>{other.location}</span>
                        <span className="text-brand">{other.type}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
