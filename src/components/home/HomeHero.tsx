import { ImageTrail } from "@/components/ui/image-trail";
import { heroTrailImages, homeCopy } from "@/data/home";

/**
 * Homepage hero, from Figma 2078:44133. "MORE MUSIC MORE LIFE" is Daltown
 * 260/208, wrapping to two lines inside the comp's 786px text box; the
 * little yellow equaliser in the bottom-right corner is the comp's four bars,
 * kept moving. Moving the cursor across the hero leaves a trail of SEVENPM
 * concert photos behind the copy (`ImageTrail`); the native cursor and touch
 * scrolling are left alone.
 */
export function HomeHero() {
  return (
    <section className="relative">
      <ImageTrail
        images={heroTrailImages}
        hideCursor={false}
        spacing={72}
        duration={1100}
        imageSize={180}
        cornerRadius={0}
        fadeInDuration={0.35}
        fadeOutDuration={0.6}
        fadeInBlur={0}
        fadeOutBlur={8}
        maxTrailImages={14}
        className="w-full"
      >
        <div className="shell relative flex flex-col items-start gap-6 pb-16 pt-6 xl:pb-24 xl:pt-[79px]">
          <h1 className="display-text w-full max-w-[786px]" data-reveal="clip">
            {homeCopy.heroTitle}
          </h1>
          <p
            className="max-w-[786px] font-[family-name:var(--font-display)] text-[18px] leading-[1.6] text-content-secondary"
            data-reveal="up"
            data-reveal-delay="0.12"
          >
            {homeCopy.intro}
          </p>

          <div
            className="eq-bars absolute bottom-16 right-[var(--shell-gutter)] hidden items-end gap-0.5 xl:flex"
            aria-hidden
          >
            <span style={{ "--h": "6px", "--d": "0s" } as React.CSSProperties} />
            <span
              style={{ "--h": "16px", "--d": "-0.4s" } as React.CSSProperties}
            />
            <span
              style={{ "--h": "12px", "--d": "-0.8s" } as React.CSSProperties}
            />
            <span
              style={{ "--h": "2px", "--d": "-1.2s" } as React.CSSProperties}
            />
          </div>
        </div>
      </ImageTrail>
    </section>
  );
}
