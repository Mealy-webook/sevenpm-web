import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionProvider } from "@/components/motion/MotionProvider";
import type { LegalDoc } from "@/data/legal";
import { legalCopy } from "@/data/legal";

/**
 * A legal document: the title at display size, then the sections on the
 * article measure. The same frame serves both, so the two cannot drift apart.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <section className="relative py-16 xl:py-24">
          <div className="shell flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h1
                className="account-panel-title m-0 font-daltown uppercase text-white"
                data-no-split
                data-reveal="clip"
              >
                {doc.title}
              </h1>
              <p className="m-0 max-w-[634px] font-[family-name:var(--font-display)] text-body-l text-content-secondary">
                {doc.standfirst}
              </p>
              <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-content-secondary">
                {legalCopy.updated} {doc.updated}
              </p>
            </div>

            <div className="flex max-w-[836px] flex-col gap-10">
              {doc.sections.map((section) => (
                <section key={section.heading} className="flex flex-col gap-3">
                  <h2 className="m-0 font-[family-name:var(--font-display)] text-title-body font-bold uppercase tracking-[-0.11px] text-content-primary">
                    {section.heading}
                  </h2>
                  {section.body.map((line) => (
                    <p
                      key={line}
                      className="m-0 font-[family-name:var(--font-display)] text-body-l text-content-secondary"
                    >
                      {line}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
