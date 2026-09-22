"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExpoScaleEase } from "gsap/EasePack";

import styles from "./GalleryBento.module.css";

gsap.registerPlugin(Flip, ScrollTrigger, ExpoScaleEase);

/**
 * The gallery as a scrubbed bento, after GSAP's own demo of the pattern.
 *
 * The grid has two sizes: the mosaic you see, and a final state whose tracks
 * are 100vw wide. Flip measures the difference and ScrollTrigger scrubs it
 * while the section is pinned, so scrolling flies into the photographs rather
 * than moving past them.
 *
 * Three things the demo is right about and this keeps:
 * - The final class goes on only long enough for `Flip.getState` to read it.
 *   Painted, it would flash the blown-up grid for a frame.
 * - `simple: true`, because nothing here is rotated or skewed and the cheap
 *   path is exact for a plain scale-and-move.
 * - Everything is rebuilt on resize. The tracks are in viewport units, so the
 *   captured end state is wrong the moment the window changes.
 *
 * A `gsap.context` owns the tween and the trigger, which is what makes the
 * rebuild and the unmount a one-line revert.
 */
export function GalleryBento({ images }: { images: string[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const gallery = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapEl = wrap.current;
    const galleryEl = gallery.current;
    if (!wrapEl || !galleryEl) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    let ctx: gsap.Context | undefined;

    const build = () => {
      ctx?.revert();
      galleryEl.classList.remove(styles.final);
      if (still.matches || small.matches) return;

      ctx = gsap.context(() => {
        const items = galleryEl.querySelectorAll(`.${styles.item}`);

        /* On for one frame, to be measured rather than seen. */
        galleryEl.classList.add(styles.final);
        const state = Flip.getState(items);
        galleryEl.classList.remove(styles.final);

        const flip = Flip.to(state, {
          simple: true,
          ease: "expoScale(1, 5)",
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: galleryEl,
              start: "center center",
              end: "+=100%",
              scrub: true,
              pin: wrapEl,
            },
          })
          .add(flip);

        return () => gsap.set(items, { clearProps: "all" });
      }, wrapEl);
    };

    build();
    window.addEventListener("resize", build);

    return () => {
      window.removeEventListener("resize", build);
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={wrap} className={styles.wrap}>
      <div ref={gallery} className={styles.gallery}>
        {images.slice(0, 6).map((src, index) => (
          <div key={src} className={styles.item}>
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 767px) 34vw, 33vw"
              priority={index < 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
