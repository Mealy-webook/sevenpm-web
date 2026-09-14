"use client";

import Image from "next/image";
import { useState } from "react";

import type { JobRole } from "@/data/careers";
import { careersCopy } from "@/data/careers";
import { ApplyDialog } from "./ApplyDialog";

/**
 * The Apply button, in both the shapes the comps use: the white button with
 * an arrow on a role row (2231:9987), and the full-width one at the bottom
 * of the "at a glance" card (2231:10270). It owns the dialog.
 */
export function ApplyButton({
  role,
  variant = "row",
}: {
  role: JobRole;
  variant?: "row" | "block";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor="Apply"
        data-magnetic={variant === "row" ? "0.15" : undefined}
        className={`flex shrink-0 cursor-pointer items-center justify-center gap-2 bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-brand ${
          variant === "block" ? "w-full" : ""
        }`}
      >
        {careersCopy.applyCta}
        {variant === "row" && (
          <Image
            src="/assets/ic-arrow-right-20.svg"
            alt=""
            width={20}
            height={20}
            className="size-5"
          />
        )}
      </button>
      <ApplyDialog role={role} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
