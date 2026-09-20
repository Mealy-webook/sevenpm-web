import Image from "next/image";

import { DisplayHeading } from "@/components/ui/DisplayHeading";

/**
 * One chapter of the editorial homepage: a full screen on a full-bleed
 * photograph, scrimmed dark from the left so the type sits on the page's own
 * ground and the picture comes through on the right. The number is set in
 * the display face in brand; the title is the site's section heading, so the
 * chapters read as the same family as the event page.
 */
export function Chapter({
  id,
  number,
  title,
  image,
  children,
}: {
  id: string;
  number: string;
  title: string;
  image: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      /* A screen tall at least, but laid out from the top rather than
         centred: a chapter whose content runs past the fold would otherwise
         push its own title up under the fixed header. The top padding is the
         header's height plus a line. */
      className="chapter relative isolate flex min-h-[calc(100svh-var(--header-h,0px))] flex-col justify-start overflow-hidden pb-16 pt-[calc(var(--header-h,0px)+40px)] xl:pb-24 xl:pt-[calc(var(--header-h,0px)+56px)]"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        className="chapter-photo -z-20 object-cover"
        data-parallax="-0.08"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,11,14,0.97)_0%,rgba(11,11,14,0.9)_38%,rgba(11,11,14,0.62)_70%,rgba(11,11,14,0.45)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-[linear-gradient(180deg,transparent,rgba(11,11,14,0.9))]"
      />

      <div className="shell relative flex flex-col gap-10 xl:gap-14">
        <div className="flex items-end gap-5 xl:gap-8">
          <span
            className="font-daltown text-[48px] leading-[0.8] text-brand xl:text-[72px]"
            data-reveal="up"
          >
            {number}
          </span>
          <DisplayHeading align="left" reveal="clip" className="!w-auto">
            {title}
          </DisplayHeading>
        </div>
        {children}
      </div>
    </section>
  );
}
