import clsx from "clsx";

export default function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        "w-full rounded-2xl border border-white/10 bg-night-700/90 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/40",
        className
      )}
      {...props}
    />
  );
}

