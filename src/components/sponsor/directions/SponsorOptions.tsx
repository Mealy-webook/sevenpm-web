import { GalleryBento } from "@/components/home/GalleryBento";
import { galleryImages } from "@/data/home";
import {
  AudienceCards,
  AudienceTiles,
  CaseRail,
  CaseRows,
  ClosingBill,
  FormatRail,
  FormatRows,
  FormatStubs,
  HeroCentered,
  HeroSplit,
  HeroWord,
  HowFaq,
  HowRows,
  PartnerBand,
  TrustWall,
} from "../kit";

/**
 * Three ways to put the Become a sponsor page together, each from one of
 * the site's existing pages so the result reads as a sibling of it.
 */

/** D · Festival page — laid out like the event details page. */
export function SponsorFestivalPage() {
  return (
    <>
      <HeroCentered />
      <FormatStubs />
      <AudienceTiles />
      <CaseRail />
      <HowFaq />
      <TrustWall />
      <ClosingBill />
    </>
  );
}

/** E · Hospitality — laid out like the event page's hospitality block. */
export function SponsorHospitalityPage() {
  return (
    <>
      <HeroSplit />
      <FormatRail />
      <AudienceCards />
      <CaseRows />
      <HowRows />
      <TrustWall />
      <ClosingBill />
    </>
  );
}

/** F · Homepage — laid out like the homepage. */
export function SponsorHomePage() {
  return (
    <>
      <HeroWord />
      <PartnerBand />
      <FormatRows />
      <section className="relative py-16 xl:py-20">
        <GalleryBento images={galleryImages} />
      </section>
      <CaseRail />
      <HowRows />
      <ClosingBill />
    </>
  );
}
