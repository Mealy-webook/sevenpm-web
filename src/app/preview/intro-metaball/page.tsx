"use client";

import { useState } from "react";

import { MetaballIntro } from "@/components/motion/MetaballIntro";

/**
 * The reference shot's intro, on its own so it can be replayed without
 * reloading the site. Review chrome.
 */
export default function MetaballIntroPreview() {
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <main className="relative min-h-svh bg-bg-primary">
      <div className="shell flex flex-col gap-4 py-16">
        <h1 className="m-0 font-daltown text-[clamp(40px,6vw,88px)] uppercase leading-[0.9] text-white">
          Intro
        </h1>
        <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-secondary">
          Metaballs on black inside a dot grid, flooding outward in brand and
          taking the screen, then wiping up. The dots inverting as the flood
          passes under them is the part that sells it.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setRun((n) => n + 1);
          }}
          className="mt-2 flex h-[52px] w-fit cursor-pointer items-center bg-white px-6 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[1.5px] text-[#18181b] transition-colors hover:bg-brand"
        >
          {done ? "Play again" : "Playing…"}
        </button>
      </div>

      <MetaballIntro key={run} onDone={() => setDone(true)} />
    </main>
  );
}
