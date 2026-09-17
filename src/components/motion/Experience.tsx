import { DeckHost } from "@/components/event/DeckHost";
import { Cursor } from "./Cursor";
import { PageTransition } from "./PageTransition";
import { Preloader } from "./Preloader";
import { ScrollProgress } from "./ScrollProgress";
import { SmoothScroll } from "./SmoothScroll";

/**
 * Site-wide layer mounted once in the root layout: smooth scrolling, the
 * custom cursor, the first-visit preloader, route transitions, the scroll
 * progress line, a film grain over everything, and the site's single <audio>
 * element. The deck is mounted here rather than on the event page so the music
 * survives the walk into the booking journey. Page-level scroll motion stays in
 * `MotionProvider`.
 */
export function Experience() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <PageTransition />
      <ScrollProgress />
      <Cursor />
      <DeckHost />
      <div className="grain" aria-hidden />
    </>
  );
}
