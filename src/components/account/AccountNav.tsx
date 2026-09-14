import Image from "next/image";
import Link from "next/link";

import { LogoutButton } from "@/components/auth/LogoutButton";

import type { AccountNavItem } from "@/data/account";
import { logoutCopy } from "@/data/account";

/**
 * Account sidebar, from Figma 2173:25810: 293px column of navigation rows
 * (icon, label, optional trailing value or count), a divider, then Logout.
 * The active row sits on the brand-yellow "accent" background with dark
 * text; its icon is darkened with a filter so one white SVG serves both.
 */
export function AccountNav({
  items,
  activeId,
  counts = {},
}: {
  items: AccountNavItem[];
  activeId: string;
  counts?: Record<string, number>;
}) {
  const row =
    "flex w-full items-center gap-4 pl-4 pr-3 drop-shadow-[0px_4px_12px_rgba(0,0,0,0.12)] transition-colors";

  return (
    <nav
      aria-label="Account"
      className="flex w-full flex-col gap-4 lg:w-[293px] lg:shrink-0"
    >
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {items.map((item) => {
          const active = item.id === activeId;
          const count = counts[item.id];
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${row} ${
                  active
                    ? "bg-brand text-[#18181b]"
                    : "text-content-primary hover:bg-white/5"
                }`}
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={24}
                  height={24}
                  className={`size-6 shrink-0 ${active ? "brightness-0" : ""}`}
                />
                <span className="flex min-w-0 flex-1 items-center gap-2 py-3">
                  <span className="flex-1 truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px]">
                    {item.label}
                  </span>
                  {item.trailing && (
                    <span
                      className={`font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] ${
                        active ? "text-[#18181b]" : "text-content-primary"
                      }`}
                    >
                      {item.trailing}
                    </span>
                  )}
                  {count ? (
                    // On the yellow row the comp uses a black pill; off it,
                    // that pill would vanish into the page.
                    <span
                      className={`flex size-5 items-center justify-center rounded-full font-[family-name:var(--font-display)] text-[12px] font-semibold leading-none ${
                        active
                          ? "bg-[#0b0b0e] text-white"
                          : "bg-white/10 text-content-primary"
                      }`}
                    >
                      {count}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <span className="block h-px w-full bg-border-tertiary" aria-hidden />

      <LogoutButton className={`${row} text-content-primary hover:bg-white/5`}>
        <Image
          src="/assets/ic-acct-logout.svg"
          alt=""
          width={24}
          height={24}
          className="size-6 shrink-0"
        />
        <span className="flex-1 py-3 text-left font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px]">
          {logoutCopy.label}
        </span>
      </LogoutButton>
    </nav>
  );
}
