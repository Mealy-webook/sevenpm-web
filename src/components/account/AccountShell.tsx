import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AccountGuard } from "@/components/account/AccountGuard";
import { AccountNav } from "@/components/account/AccountNav";
import { LoyaltyBanner } from "@/components/account/LoyaltyBanner";
import { accountNav } from "@/data/account";

/**
 * The frame every account screen shares, from Figma 2173:25780 and 2449:37125:
 * header without the account button, the member band on the secondary
 * background, then the 293px sidebar beside the panel. No footer — the comp is
 * a single 853px screen, so the section fills the viewport.
 *
 * The band is the same on every tab (2449:37125): the name in Daltown beside
 * the membership chip on the left, the Beats card with the membership track on
 * the right. Rewards included — it has no header of its own.
 *
 * Nothing in here animates. Switching account tabs changes only the panel on
 * the right, so the route wipe is skipped (see `PageTransition`) and the
 * panels carry no reveals — a settings area should feel like tabs, not like
 * five separate pages.
 */
export function AccountShell({
  activeId,
  counts,
  children,
}: {
  activeId: string;
  counts?: Record<string, number>;
  children: React.ReactNode;
}) {
  return (
    <>
      <MotionProvider />
      <SiteHeader hideAccount surface="secondary" />
      <main className="account-main flex flex-col">
        <AccountGuard>
          <LoyaltyBanner />

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
