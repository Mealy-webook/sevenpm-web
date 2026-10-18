import type { PageBlock } from "@/data/pages";

/**
 * The body of a standard inner page: numbered blocks, each a short heading
 * over a paragraph, ruled off from one another.
 *
 * Numbered because these pages are arguments rather than lists — the order is
 * the point — and the figure gives the eye somewhere to land in a column that
 * is otherwise all text.
 */
export function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
  return (
    <section className="relative py-8 xl:py-12">
      <div className="shell flex flex-col">
        {blocks.map((block, index) => (
          <div
            key={block.title}
            data-reveal="up"
            className="flex flex-col gap-4 border-t border-white/10 py-8 lg:flex-row lg:gap-12 xl:py-10"
          >
            <p className="m-0 w-16 shrink-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-white/35 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="m-0 w-full lg:max-w-[280px] lg:shrink-0 font-[family-name:var(--font-display)] text-title-section font-black uppercase tracking-[-0.01em] text-white sm:text-title-screen">
              {block.title}
            </h2>
            <p className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-body text-content-secondary">
              {block.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
