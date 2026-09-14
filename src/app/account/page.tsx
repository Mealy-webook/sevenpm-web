import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AccountNav } from "@/components/account/AccountNav";
import { BookingsPanel } from "@/components/account/BookingsPanel";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { accountNav, accountUser, bookings } from "@/data/account";

export const metadata: Metadata = {
  title: "My bookings — SEVENPM",
  robots: { index: false },
};

/**
 * Account — bookings, from Figma 2173:25780 (empty) and 2173:25975 (one
 * upcoming booking). The header drops the account button here; the name
 * band is Daltown 160/108 on the secondary background; below it the sidebar
 * and the bookings panel sit in a 32px-gap row. No footer — the comp is a
 * single 853px screen, so the section fills the viewport instead.
 */
export default function AccountPage() {
  const upcoming = bookings.filter(
    (b) => new Date(b.endsAt) >= new Date(),
  ).length;

  return (
    <>
      <MotionProvider />
      <SiteHeader hideAccount />
      <main className="flex min-h-screen flex-col">
        {/* Name band */}
        <section className="bg-bg-secondary">
          <div className="shell flex flex-col gap-3 pb-12 pt-8">
            <DisplayHeading
              as="h1"
              align="left"
              className="account-name"
              reveal="clip"
            >
              {accountUser.name}
            </DisplayHeading>
            <p
              className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-secondary"
              data-reveal="up"
              data-reveal-delay="0.15"
            >
              {accountUser.email}
            </p>
          </div>
        </section>

        {/* Sidebar + panel */}
        <section className="flex-1">
          <div className="shell flex flex-col gap-8 py-10 lg:flex-row lg:items-start">
            <AccountNav
              items={accountNav}
              activeId="bookings"
              counts={{ bookings: upcoming }}
            />
            <BookingsPanel bookings={bookings} />
          </div>
        </section>
      </main>
    </>
  );
}
