import Image from "next/image";

/**
 * Account dropdown, from Figma 2091:45854 (294 × 324). Opens under the
 * account button in the header.
 */

export type AccountUser = {
  name: string;
  email: string;
  avatar: string;
  walletBalance: string;
};

function Row({
  icon,
  label,
  trailing,
  href,
  onClick,
}: {
  icon: string;
  label: string;
  trailing?: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <Image src={icon} alt="" width={24} height={24} className="size-6 shrink-0" />
      <span className="flex min-w-0 flex-1 items-center gap-2 py-3">
        <span className="flex-1 truncate text-left font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
          {label}
        </span>
        {trailing && (
          <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
            {trailing}
          </span>
        )}
        {href && (
          <Image
            src="/assets/ic-chevron-right.svg"
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
          />
        )}
      </span>
    </>
  );
  const className =
    "menu-row flex w-full items-center gap-4 border border-border-tertiary pl-4 pr-3 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.12)] transition-colors hover:bg-white/5";

  return href ? (
    <a href={href} role="menuitem" className={className}>
      {inner}
    </a>
  ) : (
    <button type="button" role="menuitem" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

export function AccountMenu({
  user,
  id,
  labelledBy,
}: {
  user: AccountUser;
  id: string;
  labelledBy: string;
}) {
  return (
    <div
      id={id}
      role="menu"
      aria-labelledby={labelledBy}
      className="popover flex w-[294px] flex-col gap-2 bg-[rgba(37,37,37,0.5)] p-4 backdrop-blur-2xl"
    >
      <div className="flex w-full items-center gap-4">
        <span className="relative block size-9 shrink-0 overflow-hidden">
          <Image src={user.avatar} alt="" fill sizes="36px" className="object-cover" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col py-3">
          <span className="truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
            {user.name}
          </span>
          <span className="truncate font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {user.email}
          </span>
        </span>
      </div>

      <a
        href="#profile"
        role="menuitem"
        className="btn-secondary flex w-full items-center justify-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary"
      >
        View profile
      </a>

      <div className="flex w-full flex-col gap-2">
        <Row icon="/assets/ic-ticket.svg" label="My bookings" href="#bookings" />
        <Row
          icon="/assets/ic-wallet.svg"
          label="Wallet"
          trailing={user.walletBalance}
          href="#wallet"
        />
      </div>

      <Row icon="/assets/ic-logout.svg" label="Logout" onClick={() => {}} />
    </div>
  );
}
