import clsx from "clsx";

export default function Card({
  className,
  contentClassName,
  children,
  padding = "p-6",
  interactive = false,
}) {
  const innerClasses = clsx("relative", padding, contentClassName ?? className);

  return (
    <div
      className={clsx(
        "group/card relative overflow-hidden rounded-[26px] border border-white/10 bg-night-700/80 shadow-surface backdrop-blur-xl",
        interactive &&
          "transition-transform transition-colors duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-surface-strong",
        className
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.35),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        aria-hidden
      />
      <div className={innerClasses}>{children}</div>
    </div>
  );
}

