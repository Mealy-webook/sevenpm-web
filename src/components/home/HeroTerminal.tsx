"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import FaultyTerminal from "@/components/ui/FaultyTerminal";

/**
 * The hero's ground: React Bits' FaultyTerminal, tinted brand.
 *
 * Two things it needs that the component does not do for itself.
 *
 * It is a full-screen fragment shader on a rAF loop, and the hero is the
 * top of a long page — left running it would burn a GPU core for the whole
 * scroll. An observer pauses it the moment the hero leaves the viewport.
 *
 * And it holds nothing back on its own, so a scrim goes over it: the
 * headline and the standfirst sit on this, and a terminal at full strength
 * behind live type is unreadable.
 */
/**
 * The shader only runs where it is affordable.
 *
 * It is a full-screen fragment shader on a rAF loop. On a phone that is the
 * single most expensive thing on the page — jank while scrolling and a
 * measurable drain on the battery — for a background. So it is asked for
 * three things: a window wide enough that the hero is the desktop
 * composition, a device that admits to some headroom, and no request for
 * reduced motion. Anything else gets the still below, which is CSS and
 * costs nothing.
 *
 * `deviceMemory` and `hardwareConcurrency` are hints, not guarantees, and
 * Safari reports neither — an unknown device is given the benefit of the
 * doubt as long as the window is wide, since a narrow one is the case that
 * actually matters.
 */
const QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

type NavigatorWithHints = Navigator & { deviceMemory?: number };

function canAfford() {
  if (!window.matchMedia(QUERY).matches) return false;
  const nav = navigator as NavigatorWithHints;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4)
    return false;
  if (
    typeof nav.hardwareConcurrency === "number" &&
    nav.hardwareConcurrency <= 4
  )
    return false;
  return true;
}

/* Subscribed rather than read in an effect: setting state synchronously from
   an effect cascades a second render, and the server has no media query to
   read at all. The server says no, so nothing renders WebGL before hydration
   and a weak device never builds a context it cannot pay for. */
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function HeroTerminal() {
  const holder = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(false);

  const live = useSyncExternalStore(
    subscribe,
    useCallback(() => canAfford(), []),
    useCallback(() => false, []),
  );

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const paused = offscreen;

  return (
    /* Up behind the fixed header, not stopping under it. The hero starts
       below the header's in-flow spacer, so a plain `inset-0` leaves a bare
       strip across the top of the page. */
    <div
      ref={holder}
      aria-hidden
      className="absolute inset-x-0 bottom-0 top-[calc(-1*var(--header-h,0px))] z-0"
    >
      {live ? (
        /* Pulled well back from where it started. The 2482:25005 hero is
           centred with a photograph set into the word, and at full strength
           this field fought it for the middle of the screen — the hero it was
           tuned against was ranged left, which left the field a clear half to
           live in. Brightness is roughly a third of what it was, the glitch
           and flicker are most of the way down, and it is wrapped in an
           opacity so the whole thing can be moved with one number. */
        <div className="absolute inset-0 opacity-45">
          <FaultyTerminal
            scale={1.6}
            gridMul={[2, 1]}
            digitSize={1.3}
            timeScale={0.3}
            pause={paused}
            scanlineIntensity={0.3}
            glitchAmount={0.35}
            flickerAmount={0.3}
            noiseAmp={0.7}
            chromaticAberration={0}
            dither={0.3}
            curvature={0.12}
            tint="#fbeb1c"
            mouseReact
            mouseStrength={0.25}
            pageLoadAnimation
            brightness={0.22}
          />
        </div>
      ) : (
        /* The still: the terminal's dot field and its tint, as two gradients.
           No canvas, no loop, nothing to decode. */
        <span
          className="absolute inset-0 block bg-bg-primary"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(251,235,28,0.12) 1px, transparent 1.4px), radial-gradient(ellipse 80% 60% at 50% 40%, rgba(251,235,28,0.06), transparent 70%)",
            backgroundSize: "14px 14px, 100% 100%",
          }}
        />
      )}

      {/* The scrim, heaviest where the headline sits. It is tighter and
          darker in the middle than it was: the headline is centred now, so
          the clearing it needs is a disc in the centre rather than a band
          across the whole fold. */}
      <span className="pointer-events-none absolute inset-0 block bg-[radial-gradient(ellipse_58%_45%_at_50%_50%,rgba(11,11,14,0.94),rgba(11,11,14,0.6)_55%,rgba(11,11,14,0.8))]" />
    </div>
  );
}
