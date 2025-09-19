import clsx from "clsx";

export default function Card({ className, children, padding = "p-6", interactive = false }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        padding,
        interactive &&
          "transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
