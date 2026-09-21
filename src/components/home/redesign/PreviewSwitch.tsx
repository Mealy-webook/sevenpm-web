"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Review chrome for the homepage options: a fixed strip to flip between the
 * page as it is and the proposals. Not part of the design — it goes when one
 * of them is chosen.
 */
const OPTIONS = [
  { href: "/", label: "Current" },
  { href: "/preview/home-stage", label: "A · Stage" },
  { href: "/preview/home-editorial", label: "B · Editorial" },
  { href: "/preview/home-poster", label: "C · Poster" },
  { href: "/preview/home-broadcast", label: "D · Broadcast" },
  { href: "/preview/home-artefacts", label: "E · Artefacts" },
];

export function PreviewSwitch() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Homepage options"
      className="fixed bottom-6 right-6 z-[70] flex max-w-[calc(100vw-96px)] flex-wrap items-center justify-end gap-1 border border-white/10 bg-bg-secondary/90 p-1 backdrop-blur"
    >
      {OPTIONS.map((option) => {
        const active = pathname === option.href;
        return (
          <Link
            key={option.href}
            href={option.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap px-3 py-2 font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase tracking-[1.2px] transition-colors ${
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
