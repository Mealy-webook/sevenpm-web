import { homeStats } from "@/data/home";

/**
 * The band under the hero, from Figma 2227:5202: four figures across the
 * 1272 column, each 282 wide — the number in Daltown over a one-line label.
 */
export function HomeStats() {
  return (
    <section aria-label="SEVENPM in numbers" className="py-16 xl:py-24">
      <div className="shell grid grid-cols-2 gap-x-12 gap-y-10 lg:grid-cols-4">
        {homeStats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-4"
            data-reveal="up"
            data-reveal-stagger
          >
            <p className="m-0 font-daltown text-[56px] leading-[0.8] text-white xl:text-[72px]">
              {stat.value}
            </p>
            <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[29px] tracking-[0.15px] text-content-secondary xl:text-[17px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
