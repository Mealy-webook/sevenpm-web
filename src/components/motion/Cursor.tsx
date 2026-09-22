"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Custom cursor for fine pointers: a small dot that tracks the pointer and a
 * ring that eases behind it. Over links and buttons the ring grows; over an
 * element with `data-cursor="Play"` it fills yellow and shows the word.
 * Touch devices never see it, and the native cursor comes back if JS fails.
 *
 * The booking journey keeps the native cursor: it is a form with steppers,
 * fields and small controls, and a lagging ring makes precise targets harder
 * to hit. Anywhere someone is spending money, the pointer is theirs.
 */

/** Routes that opt out of the custom cursor. */
const NATIVE_CURSOR = [/^\/events\/[^/]+\/book$/];
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const native = NATIVE_CURSOR.some((route) => route.test(pathname));

  useEffect(() => {
    if (native) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const d = dot.current;
    const r = ring.current;
    const l = label.current;
    if (!d || !r || !l) return;

    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(r, "x", { duration: 0.42, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.42, ease: "power3.out" });

    let state = "";
    const setState = (next: string, text = "") => {
      if (next === state && l.textContent === text) return;
      state = next;
      r.dataset.state = next;
      l.textContent = text;
    };

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        /* Some surfaces flood brand yellow under the cursor — the news rows
           do — and a yellow disc on yellow is not a cursor. They say so, and
           the ring inverts. */
        r.dataset.invert = labelled.dataset.cursorInvert ?? "";
        setState("label", labelled.dataset.cursor ?? "");
      } else if (
        target?.closest("a, button, [role=button], input, select, textarea")
      ) {
        r.dataset.invert = "";
        setState("link");
      } else {
        r.dataset.invert = "";
        setState("");
      }
      r.style.opacity = "1";
      d.style.opacity = "1";
    };
    const leave = () => {
      r.style.opacity = "0";
      d.style.opacity = "0";
    };
    const down = () => r.classList.add("is-down");
    const up = () => r.classList.remove("is-down");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [native]);

  if (native) return null;

  return (
    <div
      className="cursor pointer-events-none fixed inset-0 z-[90] hidden"
      aria-hidden
    >
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
