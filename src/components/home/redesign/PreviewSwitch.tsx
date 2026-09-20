"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Review chrome for the homepage options: a fixed strip to flip between the
 * page as it is and the two proposals. Not part of the design — it goes when
 * one of them is chosen.
 */
const OPTIONS = [
  { href: "/", label: "Current" },
  { href: "/preview/home-stage", label: "A · Stage" },
  { href: "/preview/home-editorial", label: "B · Editorial" },
];

export function PreviewSwitch() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Homepage options"
      className="fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-1 border border-white/10 bg-bg-secondary/90 p-1 backdrop-blur"
    >
      {OPTIONS.map((option) => {
        const active = pathname === option.href;
        return (
          <Link
            key={option.href}
            href={option.href}
            aria-current={active ? "page" : undefined}
            className={`px-4 py-2 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.3px] transition-colors ${
              active
                ? "bg-brand text-[#18181b]"
                : "text-content-secondary hover:text-white"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
