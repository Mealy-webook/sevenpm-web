import Link from "next/link";

/**
 * The closing band on an inner page: a yellow heading, a line of why, and the
 * way on. Same shape as `/team`'s "Want in?", which is the one the site
 * already had.
 */
export function PageCta({
  title,
  body,
  label,
  href,
}: {
  title: string;
  body: string;
  label: string;
  href: string;
}) {
  return (
    <section className="relative bg-ink-900 py-16 xl:py-24">
      <div className="shell flex flex-col items-start gap-6" data-reveal="up">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-title-screen font-black uppercase tracking-[-0.02em] text-brand sm:text-title-display">
          {title}
        </h2>
        <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-body-l text-content-secondary">
          {body}
        </p>
        <Link
          href={href}
          data-magnetic="0.2"
          className="sweep flex items-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e]"
        >
          <span className="relative z-10">{label}</span>
        </Link>
      </div>
    </section>
  );
}
