import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AccountNav } from "@/components/account/AccountNav";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { accountNav, accountUser } from "@/data/account";

/**
 * The frame every account screen shares, from Figma 2173:25780: header
 * without the account button, the name band in Daltown 160/108 on the
 * secondary background, then the 293px sidebar beside the panel. No footer —
 * the comp is a single 853px screen, so the section fills the viewport.
 */
export function AccountShell({
  activeId,
  counts,
  showEmail = true,
  children,
}: {
  activeId: string;
  counts?: Record<string, number>;
  /** The bookings comp shows the e-mail; the card-heavy screens don't. */
  showEmail?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <MotionProvider />
      <SiteHeader hideAccount />
      <main className="account-main flex flex-col">
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
            {showEmail && (
              <p
                className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-secondary"
                data-reveal="up"
                data-reveal-delay="0.15"
              >
                {accountUser.email}
              </p>
            )}
          </div>
        </section>

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
      </main>
    </>
  );
}
