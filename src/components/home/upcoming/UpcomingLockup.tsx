"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { Cta, SectionHead, bill } from "./shared";

/**
 * G · Lockup — the names are the section.
 *
 * Each festival is one ruled line with its name at full display size and
 * its details at the far end. No pictures at rest: hovering a line brings
 * its poster up under the cursor and carries it along, tipped a little, so
 * the artwork shows up when it is asked for and the page stays type.
 * On touch there is no cursor, so the poster sits at the end of the line.
 */
export function UpcomingLockup() {
  const list = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const move = (e: React.MouseEvent) => {
    const r = list.current?.getBoundingClientRect();
    if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <section aria-labelledby="up-lockup" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <SectionHead id="up-lockup" />

        <ul
          ref={list}
          onMouseMove={move}
          onMouseLeave={() => setActive(null)}
          className="relative m-0 list-none border-b border-white/10 p-0"
        >
          {bill.map((f, i) => (
            <li
              key={f.id}
              onMouseEnter={() => setActive(f.id)}
              className="relative flex flex-col gap-4 border-t border-white/10 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-8"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-[family-name:var(--font-display)] text-body-s uppercase tracking-[0.12em] text-text-secondary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className={`section-title m-0 font-daltown uppercase transition-colors duration-300 ${active && active !== f.id ? "text-white/25" : "text-white"}`}
                >
                  {f.name}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-6 lg:justify-end">
                <span className="relative block size-24 shrink-0 overflow-hidden lg:hidden">
                  <Image src={f.card as string} alt="" fill sizes="96px" className="object-cover" />
                </span>
                <span className="flex flex-col font-[family-name:var(--font-display)] text-body lg:text-right">
                  <span className="text-text-primary">{f.when}</span>
                  <span className="text-text-secondary">
                    {f.city} · {f.edition}
                  </span>
                </span>
                <Cta festival={f} />
              </div>
            </li>
          ))}

          {/* The poster under the cursor */}
          {bill.map((f, i) => (
            <span
              key={f.id}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-20 hidden size-[300px] shadow-[0_30px_70px_rgba(0,0,0,0.6)] transition-[opacity,scale] duration-300 ease-out lg:block"
              style={{
                transform: `translate(${pos.x - 150}px, ${pos.y - 150}px) rotate(${i % 2 ? 4 : -4}deg)`,
                opacity: active === f.id ? 1 : 0,
                scale: active === f.id ? "1" : "0.85",
              }}
            >
              <Image src={f.card as string} alt="" fill sizes="300px" className="object-cover" />
            </span>
          ))}
        </ul>
      </div>
    </section>
  );
}
