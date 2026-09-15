import { Cursor } from "./Cursor";
import { PageTransition } from "./PageTransition";
import { Preloader } from "./Preloader";
import { ScrollProgress } from "./ScrollProgress";
import { SmoothScroll } from "./SmoothScroll";

/**
 * Site-wide layer mounted once in the root layout: smooth scrolling, the
 * custom cursor, the first-visit preloader, route transitions, the scroll
 * progress line and a film grain over everything. Page-level scroll motion
 * stays in `MotionProvider`.
 */
export function Experience() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <PageTransition />
      <ScrollProgress />
      <Cursor />
      <div className="grain" aria-hidden />
    </>
  );
}
