import clsx from "clsx";

export default function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        "w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 shadow-inner transition focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100",
        className
      )}
      {...props}
    />
  );
}

