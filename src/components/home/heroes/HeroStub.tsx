import { homeCopy, homeStoryFounded } from "@/data/home";
import { HeroLead } from "./HeroShell";

/**
 * C · Stub.
 *
 * The hero as the thing the whole site sells: one enormous ticket. Brand
 * stock, a perforated edge, the name letterpressed across it and the fields
 * a ticket carries down the side.
 *
 * It is the artefact language the newsletter bill and the wallet card
 * already use, at hero scale, and it is the only option here that is not
 * dark — which on a page that is black from the fold down is the point.
 *
 * The tear and the barcode are drawn: a mask of notches and a repeating
 * gradient, nothing to load and nothing to go soft on a retina screen.
 */
export function HeroStub() {
  return (
    <section className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-bg-primary px-[var(--shell-gutter)]">
      <div className="hero-stub relative flex w-full max-w-[1272px] flex-col gap-8 bg-brand px-8 py-12 text-[#18181b] sm:px-14 sm:py-16">
        <span className="flex items-center gap-4 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-[#18181b]/65">
          Casablanca
          <span aria-hidden className="h-px flex-1 bg-[#18181b]/25" />
          Est. {homeStoryFounded}
          <span aria-hidden className="h-px flex-1 bg-[#18181b]/25" />
          Admit all
        </span>

        <h1
          className="hero-headline m-0 w-full text-center font-daltown uppercase leading-[0.78] text-[#18181b]"
          data-no-split
        >
          {homeCopy.heroTitle}
        </h1>

        <HeroLead tone="ink" className="mx-auto" />

        <span
          aria-hidden
          className="hero-stub-barcode mt-2 block h-[52px] w-full shrink-0"
        />
      </div>
    </section>
  );
}
