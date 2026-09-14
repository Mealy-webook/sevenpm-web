"use client";

import Link from "next/link";
import { useState } from "react";

import type { JobRole } from "@/data/careers";
import { careersCopy, roleTypes } from "@/data/careers";
import { ApplyButton } from "./ApplyButton";

/**
 * Open roles, from Figma 2231:10088 / 2231:10124: contract-type chips over
 * rows of title, location and a white Apply button. The chips filter, the
 * first is selected on load, and clicking the selected one clears it.
 */
export function RolesList({ roles }: { roles: JobRole[] }) {
  const [type, setType] = useState<string | null>(roleTypes[0] ?? null);
  const shown = type ? roles.filter((role) => role.type === type) : roles;

  return (
    <div className="flex w-full flex-col gap-6">
      <div
        role="tablist"
        aria-label="Contract type"
        className="flex flex-wrap gap-[10px]"
        data-reveal="up"
      >
        {roleTypes.map((label) => {
          const selected = type === label;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setType(selected ? null : label)}
              className={`flex h-10 cursor-pointer items-center justify-center border p-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary transition-colors ${
                selected
                  ? "border-content-primary bg-white/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <span className="px-1">{label}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="m-0 font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
          {careersCopy.empty}
        </p>
      ) : (
        <ul
          className="m-0 flex w-full list-none flex-col p-0"
          data-reveal="up"
          data-reveal-stagger
        >
          {shown.map((role) => (
            <li
              key={role.id}
              className="group flex items-center gap-4 border-b border-white/5 p-6"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
                <Link
                  href={`/careers/${role.id}`}
                  data-cursor="Open"
                  className="font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white transition-colors hover:text-brand"
                >
                  {role.title}
                </Link>
                <span className="font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
                  {role.location}
                </span>
              </div>
              <ApplyButton role={role} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
