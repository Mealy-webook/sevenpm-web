"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

import "./StickerPeel.css";

gsap.registerPlugin(Draggable, InertiaPlugin);

/**
 * StickerPeel — ported from React Bits (reactbits.dev) to TypeScript.
 *
 * Two changes from the published source, both required to run more than one
 * sticker on a page:
 *  - the four SVG filters get per-instance ids (the original hard-codes
 *    `#pointLight` etc., so every sticker would share one light source);
 *  - the class names are namespaced under `.sticker-peel`.
 */

export type StickerPeelProps = {
  /** Source URL for the sticker image. */
  imageSrc: string;
  /** Resting rotation of the artwork, in degrees. */
  rotate?: number;
  /** Percentage of the sticker peeled back on hover (0–100). */
  peelBackHoverPct?: number;
  /** Percentage peeled back while pressed (0–100). */
  peelBackActivePct?: number;
  /** Direction of the peel, in degrees. Rotates the peel axis, not the art. */
  peelDirection?: number;
  peelEasing?: string;
  peelHoverEasing?: string;
  /** Rendered width of the sticker in pixels. */
  width?: number;
  /** Height reserved for the sticker box, in pixels. Defaults to `width`. */
  height?: number;
  shadowIntensity?: number;
  lightingIntensity?: number;
  /** Where the sticker starts inside its bounds. */
  initialPosition?: "center" | { x: number; y: number };
  /** Throw the sticker on release (needs GSAP's InertiaPlugin). */
  inertia?: boolean;
  /** Accessible label — omit for purely decorative stickers. */
  label?: string;
  className?: string;
};

export function StickerPeel({
  imageSrc,
  rotate = 0,
  peelBackHoverPct = 30,
  peelBackActivePct = 40,
  peelEasing = "power3.out",
  peelHoverEasing = "power2.out",
  peelDirection = 0,
  width = 200,
  height,
  shadowIntensity = 0.6,
  lightingIntensity = 0.1,
  initialPosition = "center",
  inertia = true,
  label,
  className = "",
}: StickerPeelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLDivElement>(null);
  const pointLightRef = useRef<SVGFEPointLightElement>(null);
  const pointLightFlippedRef = useRef<SVGFEPointLightElement>(null);
  const draggableInstanceRef = useRef<Draggable | null>(null);

  // useId() contains characters that are awkward inside url(#…).
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ids = useMemo(
    () => ({
      point: `sp-point-${uid}`,
      pointFlipped: `sp-point-flipped-${uid}`,
      shadow: `sp-shadow-${uid}`,
      expand: `sp-expand-${uid}`,
    }),
    [uid],
  );

  const defaultPadding = 10;

  useEffect(() => {
    const target = dragTargetRef.current;
    if (!target) return;
    if (initialPosition === "center") return;

    gsap.set(target, { x: initialPosition.x, y: initialPosition.y });
  }, [initialPosition]);

  useEffect(() => {
    const target = dragTargetRef.current;
    if (!target) return;
    const boundsEl = target.parentNode as HTMLElement | null;
    if (!boundsEl) return;

    draggableInstanceRef.current = Draggable.create(target, {
      type: "x,y",
      bounds: boundsEl,
      inertia,
      onDrag(this: Draggable) {
        const rot = gsap.utils.clamp(-24, 24, this.deltaX * 0.4);
        gsap.to(target, { rotation: rot, duration: 0.15, ease: "power1.out" });
      },
      onDragEnd() {
        gsap.to(target, { rotation: 0, duration: 0.8, ease: "power2.out" });
      },
    })[0];

    const handleResize = () => {
      const instance = draggableInstanceRef.current;
      if (!instance) return;
      instance.update();

      const currentX = gsap.getProperty(target, "x") as number;
      const currentY = gsap.getProperty(target, "y") as number;

      const boundsRect = boundsEl.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const maxX = boundsRect.width - targetRect.width;
      const maxY = boundsRect.height - targetRect.height;

      const newX = Math.max(0, Math.min(currentX, maxX));
      const newY = Math.max(0, Math.min(currentY, maxY));

      if (newX !== currentX || newY !== currentY) {
        gsap.to(target, { x: newX, y: newY, duration: 0.3, ease: "power2.out" });
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      draggableInstanceRef.current?.kill();
    };
  }, [inertia]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateLight = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.set(pointLightRef.current, { attr: { x, y } });

      const normalizedAngle = Math.abs(peelDirection % 360);
      if (normalizedAngle !== 180) {
        gsap.set(pointLightFlippedRef.current, {
          attr: { x, y: rect.height - y },
        });
      } else {
        gsap.set(pointLightFlippedRef.current, {
          attr: { x: -1000, y: -1000 },
        });
      }
    };

    container.addEventListener("mousemove", updateLight);
    return () => container.removeEventListener("mousemove", updateLight);
  }, [peelDirection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const add = () => container.classList.add("touch-active");
    const remove = () => container.classList.remove("touch-active");

    container.addEventListener("touchstart", add);
    container.addEventListener("touchend", remove);
    container.addEventListener("touchcancel", remove);

    return () => {
      container.removeEventListener("touchstart", add);
      container.removeEventListener("touchend", remove);
      container.removeEventListener("touchcancel", remove);
    };
  }, []);

  const cssVars = useMemo(
    () =>
      ({
        "--sticker-rotate": `${rotate}deg`,
        "--sticker-p": `${defaultPadding}px`,
        "--sticker-peelback-hover": `${peelBackHoverPct}%`,
        "--sticker-peelback-active": `${peelBackActivePct}%`,
        "--sticker-peel-easing": peelEasing,
        "--sticker-peel-hover-easing": peelHoverEasing,
        "--sticker-width": `${width}px`,
        "--sticker-shadow-opacity": shadowIntensity,
        "--sticker-lighting-constant": lightingIntensity,
        "--peel-direction": `${peelDirection}deg`,
        "--sp-point-light": `url(#${ids.point})`,
        "--sp-point-light-flipped": `url(#${ids.pointFlipped})`,
        "--sp-drop-shadow": `url(#${ids.shadow})`,
        "--sp-expand-and-fill": `url(#${ids.expand})`,
      }) as React.CSSProperties,
    [
      rotate,
      peelBackHoverPct,
      peelBackActivePct,
      peelEasing,
      peelHoverEasing,
      width,
      shadowIntensity,
      lightingIntensity,
      peelDirection,
      ids,
    ],
  );

  return (
    <div
      className={`sticker-peel ${className}`}
      ref={dragTargetRef}
      style={cssVars}
      role={label ? "img" : "presentation"}
      aria-label={label}
    >
      <svg width="0" height="0" aria-hidden>
        <defs>
          <filter id={ids.point}>
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity}
              lightingColor="white"
            >
              <fePointLight ref={pointLightRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id={ids.pointFlipped}>
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity * 7}
              lightingColor="white"
            >
              <fePointLight
                ref={pointLightFlippedRef}
                x="100"
                y="100"
                z="300"
              />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id={ids.shadow}>
            <feDropShadow
              dx="2"
              dy="4"
              stdDeviation={3 * shadowIntensity}
              floodColor="black"
              floodOpacity={shadowIntensity}
            />
          </filter>

          <filter id={ids.expand}>
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
            <feFlood floodColor="rgb(179,179,179)" result="flood" />
            <feComposite operator="in" in="flood" in2="shape" />
          </filter>
        </defs>
      </svg>

      <div className="sticker-container" ref={containerRef}>
        <div className="sticker-main">
          <div className="sticker-lighting">
            {/* Plain <img>: next/image would wrap this in its own sizing box,
                which the peel clip-path and flap geometry depend on owning. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt=""
              width={width}
              height={height ?? width}
              className="sticker-image"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>

        <div className="flap">
          <div className="flap-lighting">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt=""
              width={width}
              height={height ?? width}
              className="flap-image"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StickerPeel;
