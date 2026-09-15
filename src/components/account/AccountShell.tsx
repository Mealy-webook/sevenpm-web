import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AccountGuard } from "@/components/account/AccountGuard";
import { AccountNav } from "@/components/account/AccountNav";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { accountNav, accountUser } from "@/data/account";

/**
 * The frame every account screen shares, from Figma 2173:25780: header
 * without the account button, the name band in Daltown 160/108 on the
 * secondary background, then the 293px sidebar beside the panel. No footer —
 * the comp is a single 853px screen, so the section fills the viewport.
 *
 * Nothing in here animates. Switching account tabs changes only the panel on
 * the right, so the route wipe is skipped (see `PageTransition`) and the
 * panels carry no reveals — a settings area should feel like tabs, not like
 * five separate pages.
 */
export function AccountShell({
  activeId,
  counts,
  banner,
  children,
}: {
  activeId: string;
  counts?: Record<string, number>;
  /** Replaces the name band. SevenPM Rewards puts its own greeting here. */
  banner?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <MotionProvider />
      <SiteHeader hideAccount surface="secondary" />
      <main className="account-main flex flex-col">
        <AccountGuard>
          {banner ?? (
            <section className="bg-bg-secondary">
              <div className="shell flex flex-col gap-2 pb-8 pt-6">
                {/* No reveal: the name band is part of the shell and does not
                    change between tabs, so replaying it on every switch reads
                    as a stutter. */}
                <DisplayHeading
                  as="h1"
                  align="left"
                  className="account-name"
                  animate={false}
                >
                  {accountUser.name}
                </DisplayHeading>
                <p className="m-0 font-[family-name:var(--font-display)] text-[15px] font-bold uppercase leading-5 tracking-[-0.08px] text-content-secondary">
                  {accountUser.email}
                </p>
              </div>
            </section>
          )}

          <section className="flex-1">
            <div className="shell flex flex-col gap-8 py-10 lg:flex-row lg:items-start">
              <AccountNav
                items={accountNav}
                activeId={activeId}
                counts={counts}
              />
              {children}
            </div>
          </section>
        </AccountGuard>
      </main>
    </>
  );
}
