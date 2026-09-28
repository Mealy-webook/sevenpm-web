import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AccountGuard } from "@/components/account/AccountGuard";
import { AccountIdentity } from "@/components/account/AccountIdentity";
import { AccountNav } from "@/components/account/AccountNav";
import { accountCopy, accountNav } from "@/data/account";

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
  detail = false,
  children,
}: {
  activeId: string;
  /**
   * A screen reached *from* the account menu rather than the menu itself.
   *
   * Narrow, the account is master and detail: `/account` is the list of where
   * you can go, and each entry opens on its own. Stacking the two — the whole
   * menu, then the panel under it — meant scrolling past five rows and a
   * display-size name to reach anything.
   *
   * From `lg` both columns are on screen at once and the distinction stops
   * mattering: every route draws the menu beside its panel, as before.
   */
  detail?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <MotionProvider />
      <SiteHeader hideAccount pinned compact />
      <main className="account-main flex flex-col">
        <AccountGuard>
          <section className="flex-1">
            <div className="shell flex flex-col gap-8 py-8 lg:flex-row lg:items-start lg:gap-[52px]">
              {/* 293 column: who you are, then where you can go.
                  
                  It stands above the fold and stays there: sticky under the
                  header, and no taller than the screen minus the header and
                  the section's own padding. The name scales with the viewport
                  height to hold that budget (see `AccountIdentity`). */}
              <div
                className={`w-full flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h,0px)+32px)] lg:flex lg:max-h-[calc(100svh-var(--header-h,0px)-64px)] lg:w-[293px] lg:shrink-0 ${
                  detail ? "hidden" : "flex"
                }`}
              >
                <AccountIdentity />
                {/* The nav reads `?tab=` to light the Requests row. */}
                <Suspense fallback={null}>
                  <AccountNav items={accountNav} activeId={activeId} />
                </Suspense>
              </div>
              {/* Back to the menu. Only on a detail screen, and only while
                  the menu is not on screen beside it. */}
              <div className={detail ? "contents" : "hidden lg:contents"}>
                <div className="flex min-w-0 flex-1 flex-col gap-6">
                  {detail && (
                    <Link
                      href="/account"
                      className="flex w-fit items-center gap-2 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary transition-colors hover:text-white lg:hidden"
                    >
                      <Image
                        src="/assets/ic-arrow-left-20.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="size-5"
                      />
                      {accountCopy.back}
                    </Link>
                  )}
                  {children}
                </div>
              </div>
            </div>
          </section>
        </AccountGuard>
      </main>
    </>
  );
}
