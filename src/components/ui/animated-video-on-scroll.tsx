"use client";

import * as React from "react";
import {
  type HTMLMotionProps,
  type MotionValue,
  type Variants,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Scroll-driven hero reveal (21st.dev "animated video on scroll").
 *
 * A tall `ContainerScroll` holds a `ContainerSticky` screen. As the tall
 * element travels, `ContainerInset` opens its clip-path from a rounded pill
 * to the full frame and the media scales up, while `ContainerAnimated`
 * blocks drift into place.
 *
 * Two changes from the source, both deliberate:
 *
 * - It imports from `framer-motion`, which is what this project has. The
 *   `motion` package is the same library under its newer name; adding it
 *   would put two copies of the same runtime in the bundle.
 * - `HeroButton` carries the house's own colours and square edges rather
 *   than the demo's lime pill.
 *
 * `HeroMedia` is the image counterpart of `HeroVideo` — same scale, same
 * place in the rig — so the reveal works before there is any film to put
 * in it.
 */

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

interface ContainerInsetProps extends HTMLMotionProps<"div"> {
  insetYRange?: [number, number];
  insetXRange?: [number, number];
  roundednessRange?: [number, number];
}

const SPRING_TRANSITION_CONFIG = {
  type: "spring" as const,
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
};

const variants: Variants = {
  hidden: { filter: "blur(10px)", opacity: 0 },
  visible: { filter: "blur(0px)", opacity: 1 },
};

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined);

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);
  if (!context) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScroll Component",
    );
  }
  return context;
}

export const ContainerScroll: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    /**
     * Where the travel starts and ends. The source's default assumes the
     * block sits below the fold; a hero at the top of the page wants
     * `["start start", "end end"]`, or it loads a quarter of the way open.
     */
    offset?: [string, string];
  }
> = ({
  children,
  className,
  offset = ["start center", "end end"],
  ...props
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: offset as never,
  });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-svh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};
ContainerScroll.displayName = "ContainerScroll";

interface ContainerAnimatedProps extends HTMLMotionProps<"div"> {
  inputRange?: number[];
  outputRange?: number[];
}

export const ContainerAnimated = React.forwardRef<
  HTMLDivElement,
  ContainerAnimatedProps
>(
  (
    {
      className,
      transition,
      style,
      inputRange = [0.2, 0.8],
      outputRange = [80, 0],
      ...props
    },
    ref,
  ) => {
    const { scrollYProgress } = useContainerScrollContext();
    const y = useTransform(scrollYProgress, inputRange, outputRange);
    return (
      <motion.div
        ref={ref}
        className={cn("", className)}
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ y, ...style }}
        transition={{ ...SPRING_TRANSITION_CONFIG, ...transition }}
        {...props}
      />
    );
  },
);
ContainerAnimated.displayName = "ContainerAnimated";

export const ContainerSticky = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("sticky left-0 top-0 min-h-svh w-full", className)}
      {...props}
    />
  );
});
ContainerSticky.displayName = "ContainerSticky";

export const HeroVideo = React.forwardRef<
  HTMLVideoElement,
  HTMLMotionProps<"video">
>(({ style, className, ...props }, ref) => {
  const { scrollYProgress } = useContainerScrollContext();
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.7, 1]);

  return (
    <motion.video
      ref={ref}
      className={cn("relative z-10 size-auto max-h-full max-w-full", className)}
      autoPlay
      muted
      loop
      playsInline
      style={{ scale, ...style }}
      {...props}
    />
  );
});
HeroVideo.displayName = "HeroVideo";

/** The same slot as `HeroVideo`, for a still. */
export const HeroMedia = React.forwardRef<
  HTMLImageElement,
  HTMLMotionProps<"img">
>(({ style, className, ...props }, ref) => {
  const { scrollYProgress } = useContainerScrollContext();
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.7, 1]);

  return (
    <motion.img
      ref={ref}
      className={cn("relative z-10 size-auto max-h-full max-w-full", className)}
      style={{ scale, ...style }}
      {...props}
    />
  );
});
HeroMedia.displayName = "HeroMedia";

/**
 * The media slot's scale, applied to a wrapper so `next/image` can do the
 * optimising — which is where this site's AVIF and quality settings live.
 */
export const HeroScaled = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ style, className, ...props }, ref) => {
  const { scrollYProgress } = useContainerScrollContext();
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.7, 1]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative z-10 size-full", className)}
      style={{ scale, ...style }}
      {...props}
    />
  );
});
HeroScaled.displayName = "HeroScaled";

export const HeroButton = React.forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button">
>(({ className, ...props }, ref) => {
  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      ref={ref}
      className={cn(
        "group relative flex w-fit cursor-pointer items-center border border-brand bg-brand/10 px-5 py-3 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[1.5px] text-white transition-colors hover:bg-brand hover:text-[#18181b]",
        className,
      )}
      {...props}
    />
  );
});
HeroButton.displayName = "HeroButton";

export const ContainerInset = React.forwardRef<
  HTMLDivElement,
  ContainerInsetProps
>(
  (
    {
      className,
      style,
      insetYRange = [45, 0],
      insetXRange = [45, 0],
      roundednessRange = [1000, 16],
      ...props
    },
    ref,
  ) => {
    const { scrollYProgress } = useContainerScrollContext();

    const insetY = useTransform(scrollYProgress, [0, 0.8], insetYRange);
    const insetX = useTransform(scrollYProgress, [0, 0.8], insetXRange);
    const roundedness = useTransform(scrollYProgress, [0, 1], roundednessRange);

    const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${roundedness}px)`;

    return (
      <motion.div
        ref={ref}
        className={cn(
          "pointer-events-none relative overflow-hidden",
          className,
        )}
        style={{ clipPath, ...style }}
        {...props}
      />
    );
  },
);
ContainerInset.displayName = "ContainerInset";
