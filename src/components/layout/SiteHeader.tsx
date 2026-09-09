import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps = {
  /** Signed-in user shown in the account pill. */
  user?: { name: string; avatar: string };
};

export function SiteHeader({
  user = { name: "Ahmed", avatar: "/assets/nav-avatar.png" },
}: SiteHeaderProps) {
  return (
    <header className="relative z-20">
      <div className="shell flex items-start gap-[52px] pb-8 pt-6 xl:pb-12 xl:pt-8">
        <Link href="/" aria-label="SEVENPM home" className="shrink-0">
          <Image
            src="/assets/logo-mark.svg"
            alt="SEVENPM"
            width={100}
            height={100}
            priority
            className="size-[56px] xl:size-[72px]"
          />
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
          <button
            type="button"
            className="flex items-center gap-2 bg-[rgba(37,37,37,0.5)] py-1 pl-1 pr-2 transition-colors hover:bg-[rgba(37,37,37,0.8)]"
          >
            <span className="relative block size-[44px] overflow-hidden">
              <Image
                src={user.avatar}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
            <span className="pr-1 font-[family-name:var(--font-sans)] text-[17px] font-semibold leading-6 text-content-primary">
              {user.name}
            </span>
          </button>

          <button
            type="button"
            aria-label="Change language"
            className="flex size-[52px] items-center justify-center bg-[rgba(37,37,37,0.5)] transition-colors hover:bg-[rgba(37,37,37,0.8)]"
          >
            <Image
              src="/assets/ic-globe.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </button>

          <button
            type="button"
            aria-label="Open menu"
            className="flex size-[52px] items-center justify-center bg-[rgba(37,37,37,0.5)] transition-colors hover:bg-[rgba(37,37,37,0.8)]"
          >
            <Image
              src="/assets/ic-menu.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
