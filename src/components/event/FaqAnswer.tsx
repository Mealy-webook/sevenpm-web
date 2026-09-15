"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef } from "react";

gsap.registerPlugin(SplitText);

/**
 * The answer text in the FAQ accordion, revealed a line at a time as the panel
 * opens rather than arriving whole.
 *
 * The split is made on the first open and kept: lines are measured from the
 * laid-out text, and re-splitting on every toggle would both cost more and
 * risk measuring a panel mid-collapse. `autoSplit` re-cuts the lines when the
 * width changes, which is the one thing that genuinely invalidates them.
 *
 * The panel's own 0fr → 1fr grid transition still does the opening; this only
 * moves the lines inside it.
 */
export function FaqAnswer({
  open,
  className = "",
  children,
}: {
  open: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const el = useRef<HTMLParagraphElement>(null);
  const split = useRef<SplitText | null>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!open) return;

    if (!split.current) {
      split.current = SplitText.create(node, {
        type: "lines",
        mask: "lines",
        linesClass: "faq-line",
        autoSplit: true,
      });
    }

    const tween = gsap.fromTo(
      split.current.lines,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.055,
        /* Let the panel get off the ground before the lines climb into it. */
        delay: 0.08,
        overwrite: true,
      },
    );

    return () => {
      tween.kill();
    };
  }, [open]);

  useEffect(() => {
    return () => {
      split.current?.revert();
      split.current = null;
    };
  }, []);

  return (
    <p ref={el} className={className}>
      {children}
    </p>
  );
}
