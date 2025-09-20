import clsx from "clsx";

const baseClass =
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide uppercase";

const variants = {
  default: "border-white/20 bg-white/10 text-slate-100",
  success: "border-accent-400/50 bg-accent-400/15 text-accent-100",
  warning: "border-amber-400/40 bg-amber-400/15 text-amber-100",
};

export default function Badge({ children, className, variant = "default" }) {
  return <span className={clsx(baseClass, variants[variant] ?? variants.default, className)}>{children}</span>;
}

