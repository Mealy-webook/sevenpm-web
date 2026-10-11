import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { QuoteForm } from "@/components/hospitality/QuoteForm";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import {
  getPackage,
  hospitalityCopy,
  hospitalityPackages,
} from "@/data/hospitality";

export function generateStaticParams() {
  return hospitalityPackages.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPackage(slug);
  if (!entry) return { title: "Hospitality — SEVENPM" };
  return {
    title: `${entry.name} — Hospitality — SEVENPM`,
    description: entry.summary,
  };
}

/**
 * A hospitality package, from page three of the mockup (drawn for the VIP
 * Box, and the same for all of them).
 *
 * Breadcrumb, the name and the price card, the main photograph, four specs,
 * what is included beside a photo grid, the quote form with this package
 * already chosen, and the other packages at the foot.
 */
export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getPackage(slug);
  if (!entry) notFound();

  const others = hospitalityPackages.filter((item) => item.slug !== entry.slug);

  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <section className="relative">
          <div className="shell flex flex-col gap-8 pb-10 pt-6 xl:pt-10">
            <nav
              aria-label="Breadcrumb"
              className="font-[family-name:var(--font-ui)] text-[14px] leading-5 text-white/45"
            >
              <Link href="/hospitality" className="text-brand underline underline-offset-2">
                Hospitality
              </Link>
              <span aria-hidden> / </span>
              <span>{entry.name}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,340px)] lg:gap-12">
              <div className="flex flex-col gap-5">
                <p
                  className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand"
                  data-reveal="up"
                >
                  {entry.festival} · Business package
                </p>
                <DisplayHeading as="h1" align="left" reveal="clip">
                  {entry.name}
                </DisplayHeading>
                <p
                  className="m-0 max-w-[560px] font-[family-name:var(--font-ui)] text-[17px] leading-[1.7] text-content-secondary"
                  data-split="lines"
                >
                  {entry.body}
                </p>
              </div>

              {/* The price, and the only button that matters on this page. */}
              <aside
                data-reveal="up"
                className="flex h-fit flex-col gap-3 border border-white/10 bg-ink-900 p-6"
                style={{ borderRadius: "var(--radius)" }}
              >
                <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                  {hospitalityCopy.packages.from}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[30px] font-black leading-9 text-brand">
                  {entry.price}
                </span>
                <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                  {entry.perUnit}
                </span>
                <Link
                  href="#quote"
                  className="sweep mt-2 flex items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-[#0b0b0e]"
                >
                  <span className="relative z-10">
                    {hospitalityCopy.cta.label}
                  </span>
                </Link>
              </aside>
            </div>

            <PhotoSlot
              caption={`Main photo: ${entry.photo.replace(/^Photo: /, "")}`}
              className="min-h-[260px] w-full xl:min-h-[420px]"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {entry.specs.map((spec) => (
                <div
                  key={spec.label}
                  data-reveal="up"
                  className="flex flex-col gap-1 border border-white/10 p-5"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                    {spec.label}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[17px] font-bold leading-6 text-white">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-10 xl:py-14">
          <div className="shell grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-5">
              <DisplayHeading align="left" reveal="clip" size="faq">
                What&rsquo;s included
              </DisplayHeading>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {entry.included.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 font-[family-name:var(--font-ui)] text-[16px] leading-[1.6] text-white"
                  >
                    <span aria-hidden className="mt-0.5 text-brand">
                      ✓
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              {entry.includedTodo ? (
                /* The rest of the list, still to be written. Visible on
                   purpose — it is the brief. */
                <p className="m-0 font-[family-name:var(--font-ui)] text-[15px] leading-[1.6] text-brand/80">
                  {entry.includedTodo}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {entry.gallery.map((caption) => (
                <PhotoSlot
                  key={caption}
                  caption={caption}
                  className="min-h-[160px] w-full"
                />
              ))}
            </div>
          </div>
        </section>

        <QuoteForm selected={entry.name} />

        <section className="relative border-t border-white/10 py-12 xl:py-16">
          <div className="shell flex flex-col gap-6">
            <DisplayHeading align="left" reveal="clip" size="faq">
              {hospitalityCopy.quote.otherPackages}
            </DisplayHeading>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  href={`/hospitality/${item.slug}`}
                  data-reveal="up"
                  className="flex flex-col gap-1 border border-white/10 bg-ink-900 p-5 transition-colors hover:border-white/35"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  <span className="font-[family-name:var(--font-display)] text-[17px] font-bold leading-6 text-white">
                    {item.name}
                  </span>
                  <span className="font-[family-name:var(--font-ui)] text-[14px] leading-5 text-content-secondary">
                    From {item.price}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
