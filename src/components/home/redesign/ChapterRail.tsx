"use client";

import { useEffect, useState } from "react";

/**
 * The chapter index down the left edge: number and title for each, the one
 * on screen lit. Anchors, so Lenis glides to them. Wide screens only — on a
 * phone it would sit on the text.
 */
export type ChapterRef = { id: string; number: string; title: string };

export function ChapterRail({ chapters }: { chapters: ChapterRef[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
        else if (entries.every((entry) => !entry.isIntersecting)) {
          const anyOn = sections.some((section) => {
            const rect = section.getBoundingClientRect();
            return rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
          });
          if (!anyOn) setActive(null);
        }
      },
      { threshold: [0.25, 0.5, 0.75] },
    );
    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, [chapters]);

  return (
    <nav
      aria-label="Chapters"
      className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-5 xl:flex"
    >
      {chapters.map((chapter) => {
        const on = chapter.id === active;
        return (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-current={on ? "true" : undefined}
            className="group flex items-center gap-3"
          >
            <span
              className={`font-daltown text-[22px] leading-none transition-colors ${
                on ? "text-brand" : "text-white/30 group-hover:text-white/70"
              }`}
            >
              {chapter.number}
            </span>
            <span
              className={`h-px transition-all ${
                on ? "w-8 bg-brand" : "w-4 bg-white/20 group-hover:bg-white/50"
              }`}
            />
            <span
              className={`font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase tracking-[1.2px] transition-all ${
                on
                  ? "translate-x-0 text-white opacity-100"
                  : "-translate-x-1 text-white/50 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {chapter.title}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
