"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

/**
 * The gallery's fixed-geometry stage, made interactive: every `.gallery-slot`
 * inside can be picked up and dragged anywhere within the stage, with a little
 * tilt while it moves and a throw on release — the same feel as the stickers,
 * bounded to this section.
 *
 * Stacking is handled here rather than in CSS because both GSAP's reveal and
 * Draggable leave transforms on the slot, which makes it a stacking context:
 * hovering brings a polaroid forward for the duration of the hover, picking
 * one up puts it on top of the pile for good, like real photos on a table.
 */
export function GalleryStage({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const slots = Array.from(stage.querySelectorAll<HTMLElement>(".gallery-slot"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let top = 10;

    const raise = (el: HTMLElement) => {
      top += 1;
      el.style.zIndex = String(top);
      el.dataset.restZ = String(top);
    };

    const cleanups = slots.map((el) => {
      const enter = () => {
        el.dataset.restZ = el.style.zIndex;
        el.style.zIndex = "999";
      };
      const leave = () => {
        el.style.zIndex = el.dataset.restZ ?? "";
      };
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);

      /* Bounds in the stage's own (unscaled) coordinates. Passing the stage
       * element would use its layout box, which is wider than what's on
       * screen once `--gallery-scale` shrinks it; these numbers scale with
       * the stage, so the clamp matches the visible edge at every width. */
      const bounds = {
        minX: -el.offsetLeft,
        maxX: stage.offsetWidth - el.offsetLeft - el.offsetWidth,
        minY: -el.offsetTop,
        maxY: stage.offsetHeight - el.offsetTop - el.offsetHeight,
      };

      const draggable = Draggable.create(el, {
        type: "x,y",
        bounds,
        inertia: !reduced,
        onPress() {
          raise(el);
        },
        onDrag(this: Draggable) {
          if (reduced) return;
          gsap.to(el, {
            rotation: gsap.utils.clamp(-10, 10, this.deltaX * 0.35),
            duration: 0.15,
            ease: "power1.out",
          });
        },
        onDragEnd() {
          gsap.to(el, { rotation: 0, duration: 0.8, ease: "power2.out" });
        },
      })[0];

      return () => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
        draggable.kill();
      };
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div
      ref={stageRef}
      className="absolute left-1/2 top-0"
      style={{
        width,
        height,
        marginLeft: -width / 2,
        transform: "scale(var(--gallery-scale))",
        transformOrigin: "top center",
      }}
    >
      {children}
    </div>
  );
}
