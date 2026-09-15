"use client";

import { useEffect, useRef } from "react";

/**
 * Rolls a number up to its value the first time it comes into view, then
 * leaves it alone.
 *
 * It takes the finished string ("1,000") rather than a number, so the caller
 * keeps control of the formatting and the separators stay wherever the design
 * put them. The server renders the final value: if this never runs — no JS,
 * reduced motion — the page still reads correctly, which is the only thing
 * that matters about a price.
 */
export function CountUp({
  value,
  /** Seconds to travel the whole distance. */
  duration = 1.1,
  className = "",
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = Number(value.replace(/[^\d.]/g, ""));
    if (!Number.isFinite(target) || target <= 0) return;

    /* Rebuild the caller's formatting around each intermediate number, so
       "1,000" counts through "847" and not "8,47". */
    const decimals = value.includes(".") ? 1 : 0;
    const grouped = value.includes(",");
    const render = (n: number) =>
      grouped
        ? n.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : n.toFixed(decimals);

    let frame = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / (duration * 1000));
      /* Fast out of the gate, easing into the real figure. */
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = render(target * eased);
      if (t < 1) frame = requestAnimationFrame(step);
      else node.textContent = value;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        node.textContent = render(0);
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(node);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={el} className={className}>
      {value}
    </span>
  );
}
