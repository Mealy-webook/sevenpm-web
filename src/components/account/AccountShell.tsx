import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AccountGuard } from "@/components/account/AccountGuard";
import { AccountIdentity } from "@/components/account/AccountIdentity";
import { AccountNav } from "@/components/account/AccountNav";
import { accountNav } from "@/data/account";

/**
 * The frame every account screen shares, from Figma 2173:25780 and 2449:37125:
 * header without the account button, the member band on the secondary
 * background, then the 293px sidebar beside the panel. No footer — the comp is
 * a single 853px screen, so the section fills the viewport.
 *
 * From 2467:17822 the name moved into the sidebar: the column carries who is
 * signed in — the name at display size, the membership chip, the joining year
 * — and the navigation under it, with the panel beside. The full-width band
 * that used to run under the header is gone, and the Beats card it carried is
 * on the rewards screen, the one screen it belongs to.
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
      <SiteHeader hideAccount />
      <main className="account-main flex flex-col">
        <AccountGuard>
          <section className="flex-1">
            <div className="shell flex flex-col gap-8 py-8 lg:flex-row lg:items-start lg:gap-[52px]">
              {/* 293 column: who you are, then where you can go. */}
              <div className="flex w-full flex-col gap-6 lg:w-[293px] lg:shrink-0">
                <AccountIdentity />
                <AccountNav
                  items={accountNav}
                  activeId={activeId}
                  counts={counts}
                />
              </div>
              {children}
            </div>
          </section>
        </AccountGuard>
      </main>
    </>
  );
}
