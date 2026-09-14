import type { Metadata } from "next";
import Image from "next/image";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RolesList } from "@/components/careers/RolesList";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { careersCopy, jobRoles } from "@/data/careers";

export const metadata: Metadata = {
  title: "Careers — SEVENPM",
  description: careersCopy.intro,
};

/**
 * `/careers`, from Figma 2227:6749: the centred Daltown title and intro, the
 * crew photo across the column, then the open roles under contract-type
 * chips.
 */
export default function CareersPage() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <section className="relative">
          <div className="shell flex flex-col items-center gap-12 pb-16 pt-6 xl:pt-12">
            <div className="flex w-full flex-col items-center gap-2">
              <DisplayHeading as="h1" reveal="clip">
                {careersCopy.title}
              </DisplayHeading>
              <p
                className="m-0 max-w-[838px] text-center font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white"
                data-split="lines"
                data-reveal-delay="0.1"
              >
                {careersCopy.intro}
              </p>
            </div>

            <div
              className="relative aspect-[1272/426] w-full overflow-hidden"
              data-reveal="scale"
            >
              <Image
                src="/assets/careers-crew.jpg"
                alt={careersCopy.heroImageAlt}
                fill
                sizes="(min-width: 1512px) 1272px, 100vw"
                priority
                className="object-cover"
              />
            </div>

            <div className="flex w-full flex-col gap-12">
              <h2
                className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-[1.1] tracking-[-0.02em] text-white sm:text-[36px]"
                data-reveal="up"
              >
                {careersCopy.openRolesTitle}
              </h2>
              <RolesList roles={jobRoles} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
