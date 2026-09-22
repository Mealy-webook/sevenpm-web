"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import type { NewsItem } from "@/data/home";

/**
 * The news list as an editorial hover-preview: the row floods dark from the
 * bottom edge, its text steps right and turns white, the arrow turns and
 * fills, and a thumbnail rides the cursor showing that row's photograph.
 *
 * Four things are easy to get wrong here, so they are spelled out:
 *
 * 1. The card's hidden state lives in `gsap.set`, never in CSS. Tailwind v4
 *    writes `scale`/`rotate` as their own properties and the browser
 *    multiplies those with GSAP's transform matrix — a CSS `scale: 0` pins the
 *    card at zero forever, whatever GSAP tweens it to.
 * 2. The reveal tween must not pass `overwrite: true`. It would kill the
 *    `quickTo` tweens that carry x and y, and the card would freeze wherever
 *    it happened to be.
 * 3. The frame height is read with `offsetHeight`. `getBoundingClientRect` is
 *    scaled by the transform, so while the card is hidden it reads 0 and every
 *    frame would sit on top of the first.
 * 4. Lenis moves the page without moving the pointer, so a row can slide out
 *    from under a stationary cursor and no `pointermove` ever fires. A scroll
 *    listener re-reads `elementFromPoint` at the last known position.
 *
 * None of it runs without a real pointer: `(hover: hover) and (pointer: fine)`
 * gates the whole effect, and the list is a plain list of links on a phone.
 */
export function NewsHoverList({ items }: { items: NewsItem[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stageEl = stage.current;
    const listEl = list.current;
    const cardEl = card.current;
    const trackEl = track.current;
    if (!stageEl || !listEl || !cardEl || !trackEl) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    /* Hidden state in GSAP, per note 1. The card is centred on the pointer by
       negative margins in CSS, not by xPercent/yPercent: `quickTo` writes x and
       y straight into the matrix and the percentage offsets do not survive it
       (measured: the card sat half its size down and to the right). */
    gsap.set(cardEl, { scale: 0, rotation: -6 });

    const moveX = gsap.quickTo(cardEl, "x", { duration: 0.7, ease: "power3" });
    const moveY = gsap.quickTo(cardEl, "y", { duration: 0.7, ease: "power3" });

    let shown = false;
    let current = -1;
    let lastX = 0;
    let lastY = 0;

    const show = () => {
      if (shown) return;
      shown = true;
      /* No `overwrite`, per note 2. */
      gsap.to(cardEl, { scale: 1, rotation: 0, duration: 0.6, ease: "expo.out" });
    };

    const hide = () => {
      if (!shown) return;
      shown = false;
      current = -1;
      gsap.to(cardEl, {
        scale: 0,
        rotation: -6,
        duration: 0.4,
        ease: "power2.in",
      });
    };

    const select = (row: HTMLElement | null) => {
      if (!row) {
        hide();
        return;
      }
      const index = Number(row.dataset.newsRow);
      if (index !== current) {
        current = index;
        /* offsetHeight, per note 3. */
        trackEl.style.translate = `0 ${-index * cardEl.offsetHeight}px`;
      }
      show();
    };

    const onMove = (event: PointerEvent) => {
      lastX = event.clientX;
      lastY = event.clientY;
      const rect = stageEl.getBoundingClientRect();
      moveX(event.clientX - rect.left);
      moveY(event.clientY - rect.top);
      select(
        (event.target as HTMLElement).closest<HTMLElement>("[data-news-row]"),
      );
    };

    /* Per note 4: the page can move under a still cursor. */
    const onScroll = () => {
      if (!lastX && !lastY) return;
      const under = document.elementFromPoint(lastX, lastY) as HTMLElement | null;
      const row = under?.closest<HTMLElement>("[data-news-row]") ?? null;
      if (!row) {
        hide();
        return;
      }
      const rect = stageEl.getBoundingClientRect();
      moveX(lastX - rect.left);
      moveY(lastY - rect.top);
      select(row);
    };

    listEl.addEventListener("pointermove", onMove);
    listEl.addEventListener("pointerleave", hide);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      listEl.removeEventListener("pointermove", onMove);
      listEl.removeEventListener("pointerleave", hide);
      window.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(cardEl);
    };
  }, []);

  return (
    <div ref={stage} className="news-stage relative w-full">
      <ul ref={list} className="m-0 flex w-full list-none flex-col p-0">
        {items.map((item, index) => (
          <li key={item.href} className="border-b border-white/10">
            <a
              href={item.href}
              data-news-row={index}
              data-cursor="Read"
              className="news-row relative flex w-full flex-col gap-3 py-8 lg:grid lg:grid-cols-[80px_1fr_170px_56px] lg:items-center lg:gap-6"
            >
              <span
                aria-hidden
                className="news-index font-[family-name:var(--font-display)] text-[20px] font-bold uppercase leading-none tracking-[-0.15px] text-content-secondary lg:text-[24px]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="news-headline min-w-0 font-[family-name:var(--font-display)] text-[clamp(22px,2.6vw,44px)] font-bold uppercase leading-[1.06] tracking-[-0.035em] text-content-primary">
                {item.title}
              </span>

              <time className="news-date whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] leading-6 tracking-[0.085px] text-content-secondary lg:text-[17px]">
                {item.date}
              </time>

              {/* 56 square, as the comp draws it. On hover the glyph is
                  swapped for the diagonal one and everything turns brand —
                  the button itself does not move. */}
              <span
                aria-hidden
                className="news-arrow flex size-14 shrink-0 items-center justify-center border border-white/30"
              >
                <span className="news-arrow-glyph" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* The thumbnail. No CSS scale or rotate on it — see note 1. */}
      <div ref={card} aria-hidden className="news-preview">
        <div ref={track} className="news-preview-track">
          {items.map((item) => (
            <span key={item.href} className="news-preview-frame">
              {item.image && (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
