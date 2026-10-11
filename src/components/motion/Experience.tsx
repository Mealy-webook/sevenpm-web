import { DeckHost } from "@/components/event/DeckHost";
import { PageTransition } from "./PageTransition";
import { ScrollProgress } from "./ScrollProgress";
import { SmoothScroll } from "./SmoothScroll";

/**
 * Site-wide layer mounted once in the root layout: smooth scrolling, route
 * transitions, the scroll progress line, a film grain over everything, and
 * the site's single <audio> element. The preloader is deliberately not here —
 * it belongs to the homepage and is mounted by `src/app/page.tsx`, so no
 * other route can ever be covered by it.
 *
 * The deck is mounted here rather than on the event page so the music survives
 * the walk into the booking journey. Page-level scroll motion stays in
 * `MotionProvider`.
 */
export function Experience() {
  return (
    <>
      <SmoothScroll />
      <PageTransition />
      <ScrollProgress />
      <DeckHost />
      <div className="grain" aria-hidden />
    </>
  );
}
