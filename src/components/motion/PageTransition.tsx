"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Route transitions. Clicking any internal link (same origin, new pathname,
 * no modifier keys, not `target="_blank"`) is intercepted: a yellow sheet
 * and a black sheet wipe up over the page, the route changes underneath, and
 * the sheets wipe away once the new pathname has rendered.
 *
 * The click is stopped in the capture phase so Next's own Link handler never
 * fires early; navigation happens through `router.push` when the sheets have
 * covered the page.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const sheets = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const covered = useRef(false);

  /* The deployment's base path, worked out from Next rather than from the
     environment.
     
     `usePathname` reports the app's own path — no base path — while
     `location.pathname` is the real URL's and carries it. Whatever the second
     has that the first does not is the prefix. An anchor's `pathname` carries
     it too, and the router puts it back on whatever it is handed, so a
     pathname taken straight from the DOM and pushed comes out doubled and
     every link 404s.
     
     Reading `NEXT_PUBLIC_BASE_PATH` here instead looked equivalent and was
     not: it is not inlined into this client chunk, so the constant was "",
     the correction compiled away, and the bug survived a deploy. */
  const prefix = useRef("");
  useEffect(() => {
    const loc = window.location.pathname.replace(/\/$/, "");
    const app = (pathname || "/").replace(/\/$/, "");
    prefix.current = app && loc.endsWith(app) ? loc.slice(0, -app.length) : loc;
  }, [pathname]);

  // Park the sheets below the viewport. Done here rather than with a
  // Tailwind translate class: GSAP writes `transform`, Tailwind v4 writes the
  // separate `translate` property, and the two would add up.
  useEffect(() => {
    gsap.set("[data-sheet]", { yPercent: 100 });
  }, []);

  // Intercept internal navigation.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (
        e.target as HTMLElement | null
      )?.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // hash / same page
      // Moving between the account tabs is a tab switch, not a page change:
      // the shell, the name band and the sidebar all stay put, so the wipe
      // reads as a stutter rather than a transition.
      const inAccount = (path: string) =>
        path === "/account" || path.startsWith("/account/");
      /* Both of these come out of the DOM, so under a base path they carry
         the prefix, and the router puts it back on whatever it is given.
         Compare and navigate in the app's own path space. */
      const strip = (path: string) => {
        const p = prefix.current;
        if (!p || !path.startsWith(p)) return path;
        return path.slice(p.length) || "/";
      };
      const to = strip(url.pathname);
      if (inAccount(to) && inAccount(strip(location.pathname))) return;
      e.preventDefault();
      e.stopPropagation();
      if (pending.current) return;
      pending.current = to + url.search + url.hash;

      const el = sheets.current;
      if (!el) {
        router.push(pending.current);
        return;
      }
      el.style.pointerEvents = "auto";
      gsap
        .timeline({
          onComplete: () => {
            covered.current = true;
            router.push(pending.current!);
          },
        })
        .fromTo(
          "[data-sheet=brand]",
          { yPercent: 100 },
          { yPercent: 0, duration: 0.6, ease: "expo.inOut" },
          0,
        )
        .fromTo(
          "[data-sheet=ink]",
          { yPercent: 100 },
          { yPercent: 0, duration: 0.6, ease: "expo.inOut" },
          0.12,
        );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // New route rendered: lift the sheets.
  useEffect(() => {
    if (!covered.current) return;
    const el = sheets.current;
    if (!el) return;
    covered.current = false;
    pending.current = null;
    window.scrollTo(0, 0);
    gsap
      .timeline({
        onComplete: () => {
          el.style.pointerEvents = "none";
        },
      })
      .to(
        "[data-sheet=ink]",
        { yPercent: -100, duration: 0.7, ease: "expo.inOut" },
        0.1,
      )
      .to(
        "[data-sheet=brand]",
        { yPercent: -100, duration: 0.7, ease: "expo.inOut" },
        0.2,
      )
      .set("[data-sheet]", { yPercent: 100 });
  }, [pathname]);

  return (
    <div
      ref={sheets}
      className="pointer-events-none fixed inset-0 z-[95]"
      aria-hidden
    >
      <div data-sheet="brand" className="absolute inset-0 bg-brand" />
      <div data-sheet="ink" className="absolute inset-0 bg-bg-primary" />
    </div>
  );
}
